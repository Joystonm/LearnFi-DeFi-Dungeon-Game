import React, { useState, useEffect, useContext } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import DungeonMap from './DungeonMap';
import GameHUD from './GameHUD';
import BattleSystem from './BattleSystem';
import PuzzleSystem from './PuzzleSystem';
import InventorySystem from './InventorySystem';
import ExitGameModal from './ExitGameModal';
import PowerUpSystem from './PowerUpSystem';
import { GAME_STATES, DUNGEON_ROOMS, POWER_UPS, ACHIEVEMENTS, RANDOM_EVENTS } from '../../data/gameData';

const GameEngine = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);
  const [gameState, setGameState] = useState(GAME_STATES.EXPLORING);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPowerUps, setShowPowerUps] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    xp: 0,
    level: 1,
    tokens: 1000, // Starting tokens
    portfolio: {
      supplied: {},
      borrowed: {},
      collateralFactor: 0,
      healthFactor: 1.0
    },
    activeEffects: [], // Active power-up effects
    achievements: [], // Unlocked achievements
    dailyChallenges: [], // Active daily challenges
    stats: {
      roomsCompleted: 0,
      battlesWon: 0,
      perfectPuzzles: 0,
      totalEarnings: 0
    }
  });
  const [inventory, setInventory] = useState({
    badges: [],
    powerUps: [
      { id: 'HEALTH_POTION', quantity: 2 },
      { id: 'INTEREST_BOOST', quantity: 1 }
    ], // Start with some power-ups for demo
    knowledge: []
  });
  const [randomEvent, setRandomEvent] = useState(null);

  // Handle room exit with penalty
  const handleRoomExit = (penaltyCost) => {
    // Deduct penalty tokens
    setPlayerStats(prev => ({
      ...prev,
      tokens: Math.max(0, prev.tokens - penaltyCost)
    }));

    // Show notification
    showNotification(`💸 Paid ${penaltyCost} tokens to exit room`);

    // Return to dungeon map
    setGameState(GAME_STATES.EXPLORING);
    saveProgress();
  };

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Load saved progress or start fresh
    const savedProgress = localStorage.getItem('defi-dungeon-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentRoom(progress.currentRoom || 0);
      setPlayerStats(progress.playerStats || playerStats);
      setInventory(progress.inventory || inventory);
    }
    
    // Animate game start
    gsap.fromTo('.game-container', 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
    );
  };

  const saveProgress = () => {
    const progress = {
      currentRoom,
      playerStats,
      inventory,
      timestamp: Date.now()
    };
    localStorage.setItem('defi-dungeon-progress', JSON.stringify(progress));
  };

  const enterRoom = (roomId) => {
    const room = DUNGEON_ROOMS[roomId];
    if (!room) {
      console.error('Room not found:', roomId);
      return;
    }

    console.log('Entering room:', roomId, room);
    setCurrentRoom(roomId);
    
    // Room entry animation
    gsap.fromTo('.room-content', 
      { x: 100, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.8 }
    );

    // Check room type and set appropriate game state
    switch (room.type) {
      case 'tutorial':
        console.log('Setting game state to PUZZLE for tutorial room');
        setGameState(GAME_STATES.PUZZLE); // Tutorial rooms are handled as puzzles
        break;
      case 'battle':
        console.log('Setting game state to BATTLE');
        setGameState(GAME_STATES.BATTLE);
        break;
      case 'puzzle':
        console.log('Setting game state to PUZZLE');
        setGameState(GAME_STATES.PUZZLE);
        break;
      case 'shop':
        console.log('Setting game state to SHOP');
        setGameState(GAME_STATES.SHOP);
        break;
      default:
        console.log('Setting game state to PUZZLE (default)');
        setGameState(GAME_STATES.PUZZLE); // Default to puzzle for safety
    }

    saveProgress();
  };

  const completeRoom = (rewards) => {
    // Award XP, tokens, badges
    setPlayerStats(prev => {
      const newStats = {
        ...prev,
        xp: prev.xp + rewards.xp,
        tokens: prev.tokens + rewards.tokens,
        level: Math.floor((prev.xp + rewards.xp) / 100) + 1,
        stats: {
          ...prev.stats,
          roomsCompleted: prev.stats.roomsCompleted + 1,
          totalEarnings: prev.stats.totalEarnings + rewards.tokens
        }
      };
      
      // Check for achievements
      checkAchievements(newStats);
      
      return newStats;
    });

    if (rewards.badge) {
      setInventory(prev => ({
        ...prev,
        badges: [...prev.badges, rewards.badge]
      }));
    }

    // Add power-up if included in rewards
    if (rewards.powerUp) {
      addPowerUp(rewards.powerUp);
    }

    // Victory animation
    gsap.to('.reward-popup', {
      scale: 1.2,
      rotation: 360,
      duration: 0.5,
      yoyo: true,
      repeat: 1
    });

    // Check for random events
    triggerRandomEvent();

    setGameState(GAME_STATES.EXPLORING);
    saveProgress();
  };

  const checkAchievements = (stats) => {
    Object.entries(ACHIEVEMENTS).forEach(([id, achievement]) => {
      if (stats.achievements.includes(id)) return; // Already unlocked

      let unlocked = false;
      switch (achievement.requirement.type) {
        case 'rooms_completed':
          unlocked = stats.stats.roomsCompleted >= achievement.requirement.target;
          break;
        case 'battles_survived':
          unlocked = stats.stats.battlesWon >= achievement.requirement.target;
          break;
        case 'compound_earnings':
          unlocked = stats.stats.totalEarnings >= achievement.requirement.target;
          break;
      }

      if (unlocked) {
        setPlayerStats(prev => ({
          ...prev,
          achievements: [...prev.achievements, id],
          xp: prev.xp + achievement.reward.xp,
          tokens: prev.tokens + achievement.reward.tokens
        }));

        if (achievement.reward.powerUp) {
          addPowerUp(achievement.reward.powerUp);
        }

        // Show achievement notification
        showNotification(`🏆 Achievement Unlocked: ${achievement.name}!`);
      }
    });
  };

  const addPowerUp = (powerUpId, quantity = 1) => {
    setInventory(prev => {
      const existingPowerUp = prev.powerUps.find(p => p.id === powerUpId);
      if (existingPowerUp) {
        return {
          ...prev,
          powerUps: prev.powerUps.map(p => 
            p.id === powerUpId 
              ? { ...p, quantity: p.quantity + quantity }
              : p
          )
        };
      } else {
        return {
          ...prev,
          powerUps: [...prev.powerUps, { id: powerUpId, quantity }]
        };
      }
    });
  };

  const usePowerUp = (powerUpId) => {
    const powerUp = POWER_UPS[powerUpId];
    if (!powerUp) return;

    // Apply power-up effect
    switch (powerUp.effect.type) {
      case 'heal':
        setPlayerStats(prev => ({
          ...prev,
          health: Math.min(100, prev.health + powerUp.effect.value)
        }));
        break;
      case 'apy_boost':
      case 'liquidation_immunity':
      case 'compound_boost':
      case 'price_prediction':
        setPlayerStats(prev => ({
          ...prev,
          activeEffects: [...prev.activeEffects, {
            name: powerUp.name,
            type: powerUp.effect.type,
            multiplier: powerUp.effect.multiplier,
            duration: powerUp.effect.duration
          }]
        }));
        break;
    }

    // Remove power-up from inventory
    setInventory(prev => ({
      ...prev,
      powerUps: prev.powerUps.map(p => 
        p.id === powerUpId 
          ? { ...p, quantity: p.quantity - 1 }
          : p
      ).filter(p => p.quantity > 0)
    }));

    showNotification(`✨ Used ${powerUp.name}!`);
  };

  const triggerRandomEvent = () => {
    const events = Object.values(RANDOM_EVENTS);
    const event = events[Math.floor(Math.random() * events.length)];
    
    if (Math.random() < event.probability) {
      setRandomEvent(event);
      
      // Apply event effects
      switch (event.effect.type) {
        case 'reward':
          setPlayerStats(prev => ({
            ...prev,
            tokens: prev.tokens + event.effect.tokens
          }));
          if (event.effect.powerUp === 'random') {
            const randomPowerUp = Object.keys(POWER_UPS)[Math.floor(Math.random() * Object.keys(POWER_UPS).length)];
            addPowerUp(randomPowerUp);
          }
          break;
        case 'price_change':
          // Apply price changes to portfolio
          setPlayerStats(prev => ({
            ...prev,
            portfolio: {
              ...prev.portfolio,
              // Apply multiplier to supplied assets
              supplied: Object.fromEntries(
                Object.entries(prev.portfolio.supplied).map(([token, amount]) => 
                  [token, amount * event.effect.multiplier]
                )
              )
            }
          }));
          break;
      }

      // Auto-dismiss event after duration
      setTimeout(() => setRandomEvent(null), event.duration * 1000);
    }
  };

  const handleExitGame = (penaltyCost) => {
    setPlayerStats(prev => ({
      ...prev,
      tokens: Math.max(0, prev.tokens - penaltyCost)
    }));
    
    saveProgress();
    showNotification(`💸 Paid ${penaltyCost} tokens to exit the dungeon`);
  };

  const showNotification = (message) => {
    // Create temporary notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50';
    document.body.appendChild(notification);

    // Animate and remove
    gsap.fromTo(notification, 
      { x: 300, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.5 }
    );
    
    setTimeout(() => {
      gsap.to(notification, {
        x: 300,
        opacity: 0,
        duration: 0.5,
        onComplete: () => notification.remove()
      });
    }, 3000);
  };

  const updatePortfolio = (action, token, amount) => {
    setPlayerStats(prev => {
      const newPortfolio = { ...prev.portfolio };
      
      if (action === 'supply') {
        newPortfolio.supplied[token] = (newPortfolio.supplied[token] || 0) + amount;
      } else if (action === 'borrow') {
        newPortfolio.borrowed[token] = (newPortfolio.borrowed[token] || 0) + amount;
      }
      
      // Recalculate health factor
      newPortfolio.healthFactor = calculateHealthFactor(newPortfolio);
      
      return {
        ...prev,
        portfolio: newPortfolio,
        tokens: prev.tokens - (action === 'supply' ? amount : 0)
      };
    });
  };

  const calculateHealthFactor = (portfolio) => {
    // Simplified health factor calculation
    const totalSupplied = Object.values(portfolio.supplied).reduce((sum, val) => sum + val, 0);
    const totalBorrowed = Object.values(portfolio.borrowed).reduce((sum, val) => sum + val, 0);
    
    if (totalBorrowed === 0) return 999; // No debt = infinite health
    return (totalSupplied * 0.75) / totalBorrowed; // 75% collateral factor
  };

  return (
    <div className="game-container min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white overflow-y-auto overflow-x-hidden"
         style={{ height: '100vh', WebkitOverflowScrolling: 'touch' }}>
      
      {/* Back Button */}
      <button
        onClick={() => setShowExitModal(true)}
        className="fixed top-4 left-4 z-40 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        style={{ position: 'sticky' }}
      >
        <span>←</span>
        <span>Exit Dungeon</span>
      </button>

      {/* Home Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-40 z-40 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        style={{ position: 'sticky' }}
      >
        <span>🏠</span>
        <span>Home</span>
      </button>

      {/* Power-Up Button */}
      <button
        onClick={() => setShowPowerUps(true)}
        className="fixed top-4 right-20 z-40 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        style={{ position: 'sticky' }}
      >
        <span>⚡</span>
        <span>Power-Ups</span>
      </button>

      <GameHUD 
        playerStats={playerStats}
        currentRoom={currentRoom}
        gameState={gameState}
      />
      
      {/* Random Event Notification */}
      {randomEvent && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-600 text-black px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{randomEvent.icon}</span>
            <div>
              <div className="font-bold">{randomEvent.name}</div>
              <div className="text-sm">{randomEvent.description}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="room-content">
        {gameState === GAME_STATES.EXPLORING && (
          <DungeonMap 
            currentRoom={currentRoom}
            onEnterRoom={enterRoom}
            completedRooms={inventory.badges.map(b => b.roomId)}
          />
        )}
        
        {gameState === GAME_STATES.BATTLE && (
          <BattleSystem 
            room={DUNGEON_ROOMS[currentRoom]}
            playerStats={playerStats}
            onComplete={completeRoom}
            onUpdatePortfolio={updatePortfolio}
            onRoomExit={handleRoomExit}
          />
        )}
        
        {gameState === GAME_STATES.PUZZLE && (
          <PuzzleSystem 
            room={DUNGEON_ROOMS[currentRoom]}
            playerStats={playerStats}
            onComplete={completeRoom}
            onRoomExit={handleRoomExit}
          />
        )}
      </div>
      
      <InventorySystem 
        inventory={inventory}
        playerStats={playerStats}
        isOpen={gameState === GAME_STATES.INVENTORY}
        onClose={() => setGameState(GAME_STATES.EXPLORING)}
      />

      {/* Exit Game Modal */}
      <ExitGameModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        playerStats={playerStats}
        onConfirmExit={handleExitGame}
      />

      {/* Power-Up System */}
      {showPowerUps && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="max-w-4xl w-full mx-4">
            <PowerUpSystem
              playerStats={playerStats}
              inventory={inventory}
              onUsePowerUp={usePowerUp}
              onClose={() => setShowPowerUps(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameEngine;
