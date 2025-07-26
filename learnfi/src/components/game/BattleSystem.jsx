import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TOKENS } from '../../data/gameData';
import RoomExitModal from './RoomExitModal';

const BattleSystem = ({ room, playerStats, onComplete, onUpdatePortfolio, onRoomExit }) => {
  const [enemyHealth, setEnemyHealth] = useState(room.enemy.health);
  const [battlePhase, setBattlePhase] = useState('intro'); // intro, player_turn, enemy_turn, victory, defeat
  const [selectedAction, setSelectedAction] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [turnTimer, setTurnTimer] = useState(30);
  const [playerAction, setPlayerAction] = useState(null);
  const [showRoomExit, setShowRoomExit] = useState(false);

  const battleRef = useRef(null);
  const enemyRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Battle entrance animation
    gsap.fromTo(battleRef.current, 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }
    );

    // Enemy entrance animation
    gsap.fromTo(enemyRef.current, 
      { x: 200, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 1.5, delay: 0.5, ease: 'power2.out' }
    );

    // Start battle after intro
    setTimeout(() => setBattlePhase('player_turn'), 2000);
  }, []);

  useEffect(() => {
    // Turn timer
    if (battlePhase === 'player_turn' && turnTimer > 0) {
      const timer = setTimeout(() => setTurnTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (turnTimer === 0 && battlePhase === 'player_turn') {
      // Auto-skip turn if time runs out
      handleEnemyTurn();
    }
  }, [turnTimer, battlePhase]);

  useEffect(() => {
    // Check victory/defeat conditions
    if (enemyHealth <= 0) {
      setBattlePhase('victory');
      handleVictory();
    } else if (playerStats.health <= 0 || playerStats.portfolio.healthFactor < 1.0) {
      setBattlePhase('defeat');
      handleDefeat();
    }
  }, [enemyHealth, playerStats.health, playerStats.portfolio.healthFactor]);

  const addToBattleLog = (message, type = 'info') => {
    setBattleLog(prev => [...prev, { message, type, timestamp: Date.now() }]);
  };

  const handlePlayerAction = (action) => {
    if (battlePhase !== 'player_turn') return;

    setSelectedAction(action);
    setPlayerAction(action);
    setBattlePhase('executing');

    // Animate player action
    gsap.to(playerRef.current, {
      x: 50,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      onComplete: () => executePlayerAction(action)
    });
  };

  const executePlayerAction = (action) => {
    let damage = 0;
    let message = '';

    switch (action.type) {
      case 'supply':
        if (playerStats.tokens >= action.amount) {
          onUpdatePortfolio('supply', action.token, action.amount);
          damage = calculateSupplyDamage(action);
          message = `Supplied ${action.amount} ${action.token} for ${damage} damage!`;
          addToBattleLog(message, 'success');
        } else {
          message = 'Not enough tokens!';
          addToBattleLog(message, 'error');
        }
        break;

      case 'borrow':
        if (canBorrow(action)) {
          onUpdatePortfolio('borrow', action.token, action.amount);
          damage = calculateBorrowDamage(action);
          message = `Borrowed ${action.amount} ${action.token} for ${damage} damage!`;
          addToBattleLog(message, 'success');
        } else {
          message = 'Cannot borrow - insufficient collateral!';
          addToBattleLog(message, 'error');
        }
        break;

      case 'repay':
        damage = calculateRepayDamage(action);
        message = `Repaid debt for ${damage} damage!`;
        addToBattleLog(message, 'success');
        break;

      case 'liquidate':
        damage = calculateLiquidationDamage(action);
        message = `Liquidated position for ${damage} massive damage!`;
        addToBattleLog(message, 'critical');
        break;

      default:
        message = 'Unknown action!';
        addToBattleLog(message, 'error');
    }

    // Apply damage to enemy
    setEnemyHealth(prev => Math.max(0, prev - damage));

    // Animate damage
    if (damage > 0) {
      gsap.to(enemyRef.current, {
        x: -20,
        duration: 0.2,
        yoyo: true,
        repeat: 3
      });

      // Show damage number
      const damageElement = document.createElement('div');
      damageElement.textContent = `-${damage}`;
      damageElement.className = 'absolute text-red-500 font-bold text-2xl pointer-events-none';
      damageElement.style.left = '60%';
      damageElement.style.top = '30%';
      battleRef.current.appendChild(damageElement);

      gsap.fromTo(damageElement, 
        { y: 0, opacity: 1 }, 
        { y: -50, opacity: 0, duration: 1, onComplete: () => damageElement.remove() }
      );
    }

    // Move to enemy turn
    setTimeout(() => {
      if (enemyHealth > damage) {
        handleEnemyTurn();
      }
    }, 1500);
  };

  const handleEnemyTurn = () => {
    setBattlePhase('enemy_turn');
    
    // Enemy AI selects attack based on player's current state
    const attack = selectEnemyAttack();
    
    setTimeout(() => {
      executeEnemyAttack(attack);
    }, 1000);
  };

  const selectEnemyAttack = () => {
    const attacks = room.enemy.attacks;
    
    // Smart AI: choose attack based on player's vulnerability
    if (playerStats.portfolio.healthFactor < 1.5) {
      return 'Liquidation Strike'; // Target low health factor
    } else if (Object.keys(playerStats.portfolio.borrowed).length > 0) {
      return 'Rate Spike'; // Target borrowers
    } else {
      return attacks[Math.floor(Math.random() * attacks.length)];
    }
  };

  const executeEnemyAttack = (attackName) => {
    let damage = 0;
    let message = '';

    // Animate enemy attack
    gsap.to(enemyRef.current, {
      x: -100,
      duration: 0.5,
      yoyo: true,
      repeat: 1
    });

    switch (attackName) {
      case 'Rate Spike':
        damage = 15 + Math.floor(Math.random() * 10);
        message = `${room.enemy.name} used Rate Spike! Interest rates surge!`;
        break;
      case 'Liquidation Strike':
        damage = 25 + Math.floor(Math.random() * 15);
        message = `${room.enemy.name} used Liquidation Strike! Your collateral is at risk!`;
        break;
      case 'Price Crash':
        damage = 20 + Math.floor(Math.random() * 20);
        message = `${room.enemy.name} caused a Price Crash! Asset values plummet!`;
        break;
      default:
        damage = 10 + Math.floor(Math.random() * 15);
        message = `${room.enemy.name} attacks for ${damage} damage!`;
    }

    addToBattleLog(message, 'enemy');

    // Apply damage to player (this would be handled by parent component)
    // For now, we'll just show the attack

    // Reset turn timer and return to player turn
    setTurnTimer(30);
    setBattlePhase('player_turn');
  };

  const calculateSupplyDamage = (action) => {
    const token = TOKENS[action.token];
    const baseDamage = action.amount / 10; // Base damage from amount
    const apyBonus = token.baseAPY * 2; // APY affects damage
    return Math.floor(baseDamage + apyBonus);
  };

  const calculateBorrowDamage = (action) => {
    const token = TOKENS[action.token];
    const baseDamage = action.amount / 8; // Borrowing does more damage
    const riskBonus = token.volatility === 'high' ? 10 : 5;
    return Math.floor(baseDamage + riskBonus);
  };

  const calculateRepayDamage = (action) => {
    return Math.floor(action.amount / 5); // Repaying debt does moderate damage
  };

  const calculateLiquidationDamage = (action) => {
    return Math.floor(action.amount / 3); // Liquidation does high damage but risky
  };

  const canBorrow = (action) => {
    const totalSupplied = Object.values(playerStats.portfolio.supplied).reduce((sum, val) => sum + val, 0);
    const totalBorrowed = Object.values(playerStats.portfolio.borrowed).reduce((sum, val) => sum + val, 0);
    const token = TOKENS[action.token];
    
    const maxBorrow = totalSupplied * token.collateralFactor;
    return (totalBorrowed + action.amount) <= maxBorrow;
  };

  const handleVictory = () => {
    addToBattleLog('Victory! You have defeated the enemy!', 'victory');
    
    // Victory animation
    gsap.to(enemyRef.current, {
      opacity: 0,
      scale: 0,
      rotation: 360,
      duration: 1
    });

    setTimeout(() => {
      onComplete(room.rewards);
    }, 2000);
  };

  const handleDefeat = () => {
    addToBattleLog('Defeat! You have been overcome...', 'defeat');
    
    // Defeat animation
    gsap.to(playerRef.current, {
      opacity: 0.5,
      scale: 0.8,
      duration: 1
    });
  };

  const handleRoomExit = (penaltyCost) => {
    onRoomExit(penaltyCost);
    setShowRoomExit(false);
  };

  const getActionButtons = () => {
    const actions = [];
    
    // Supply actions
    Object.entries(TOKENS).forEach(([symbol, token]) => {
      actions.push({
        type: 'supply',
        token: symbol,
        amount: 100,
        label: `Supply ${symbol}`,
        description: `Supply 100 ${symbol} to earn interest and deal damage`,
        cost: 100,
        disabled: playerStats.tokens < 100
      });
    });

    // Borrow actions (if player has collateral)
    const hasCollateral = Object.keys(playerStats.portfolio.supplied).length > 0;
    if (hasCollateral) {
      Object.entries(TOKENS).forEach(([symbol, token]) => {
        actions.push({
          type: 'borrow',
          token: symbol,
          amount: 50,
          label: `Borrow ${symbol}`,
          description: `Borrow 50 ${symbol} against your collateral`,
          cost: 0,
          disabled: !canBorrow({ token: symbol, amount: 50 })
        });
      });
    }

    return actions;
  };

  return (
    <div ref={battleRef} className="battle-system w-full min-h-screen bg-gradient-to-b from-red-900 via-purple-900 to-black text-white p-8 overflow-y-auto"
         style={{ height: '100vh', WebkitOverflowScrolling: 'touch' }}>
      
      {/* Room Exit Button */}
      <button
        onClick={() => setShowRoomExit(true)}
        className="sticky top-4 left-4 z-40 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
      >
        <span>←</span>
        <span>Exit Room</span>
      </button>

      {/* Battle header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{room.name}</h1>
        <p className="text-lg text-gray-300">{room.description}</p>
      </div>

      {/* Battle arena */}
      <div className="flex justify-between items-center mb-8 h-64">
        
        {/* Player side */}
        <div ref={playerRef} className="text-center">
          <div className="text-6xl mb-4">🧙‍♂️</div>
          <div className="text-lg font-semibold">DeFi Explorer</div>
          <div className="text-sm text-gray-400">Level {playerStats.level}</div>
          
          {/* Player health factor display */}
          <div className="mt-4 p-2 bg-blue-900 rounded">
            <div className="text-xs text-gray-300">Health Factor</div>
            <div className={`text-lg font-bold ${playerStats.portfolio.healthFactor < 1.3 ? 'text-red-400' : 'text-green-400'}`}>
              {playerStats.portfolio.healthFactor === 999 ? '∞' : playerStats.portfolio.healthFactor.toFixed(2)}
            </div>
          </div>
        </div>

        {/* VS indicator */}
        <div className="text-center">
          <div className="text-4xl font-bold text-red-500">VS</div>
          {battlePhase === 'player_turn' && (
            <div className="mt-4 text-lg">
              Time: {turnTimer}s
            </div>
          )}
        </div>

        {/* Enemy side */}
        <div ref={enemyRef} className="text-center">
          <div className="text-6xl mb-4">👹</div>
          <div className="text-lg font-semibold">{room.enemy.name}</div>
          
          {/* Enemy health bar */}
          <div className="mt-4 w-32 mx-auto">
            <div className="flex justify-between text-sm mb-1">
              <span>HP</span>
              <span>{enemyHealth}/{room.enemy.health}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-red-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(enemyHealth / room.enemy.health) * 100}%` }}
              />
            </div>
          </div>

          {/* Enemy weakness */}
          <div className="mt-2 text-xs text-yellow-400">
            Weakness: {room.enemy.weakness}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {battlePhase === 'player_turn' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {getActionButtons().map((action, index) => (
            <button
              key={index}
              onClick={() => handlePlayerAction(action)}
              disabled={action.disabled}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                action.disabled 
                  ? 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                  : 'bg-purple-700 border-purple-500 hover:bg-purple-600 hover:border-purple-400'
              }`}
            >
              <div className="font-semibold">{action.label}</div>
              <div className="text-xs text-gray-300 mt-1">{action.description}</div>
              {action.cost > 0 && (
                <div className="text-xs text-yellow-400 mt-1">Cost: {action.cost} tokens</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Battle log */}
      <div className="bg-black bg-opacity-50 rounded-lg p-4 h-32 overflow-y-auto">
        <h3 className="font-semibold mb-2">Battle Log</h3>
        <div className="space-y-1">
          {battleLog.slice(-5).map((log, index) => (
            <div 
              key={index} 
              className={`text-sm ${
                log.type === 'success' ? 'text-green-400' :
                log.type === 'error' ? 'text-red-400' :
                log.type === 'enemy' ? 'text-orange-400' :
                log.type === 'victory' ? 'text-yellow-400' :
                log.type === 'defeat' ? 'text-red-500' :
                'text-gray-300'
              }`}
            >
              {log.message}
            </div>
          ))}
        </div>
      </div>

      {/* Battle phase indicators */}
      {battlePhase === 'intro' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Battle Begins!</h2>
            <p className="text-lg">Prepare to face {room.enemy.name}!</p>
          </div>
        </div>
      )}

      {battlePhase === 'victory' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Victory!</h2>
            <p className="text-lg mb-4">You have mastered {room.concept}!</p>
            <div className="text-sm text-gray-300">
              Rewards: +{room.rewards.xp} XP, +{room.rewards.tokens} tokens
              {room.rewards.badge && <div>Badge earned: {room.rewards.badge.name}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Room Exit Modal */}
      <RoomExitModal
        isOpen={showRoomExit}
        onClose={() => setShowRoomExit(false)}
        onConfirmExit={handleRoomExit}
        playerStats={playerStats}
        currentRoom={room.id}
      />
    </div>
  );
};

export default BattleSystem;
