import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BADGES } from '../../data/gameData';

const InventorySystem = ({ inventory, playerStats, isOpen, onClose }) => {
  const inventoryRef = useRef(null);

  useEffect(() => {
    if (isOpen && inventoryRef.current) {
      gsap.fromTo(inventoryRef.current, 
        { x: '100%', opacity: 0 }, 
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(inventoryRef.current, {
      x: '100%',
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  const getBadgeRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-100';
      case 'uncommon': return 'border-green-400 bg-green-100';
      case 'rare': return 'border-blue-400 bg-blue-100';
      case 'epic': return 'border-purple-400 bg-purple-100';
      case 'legendary': return 'border-yellow-400 bg-yellow-100';
      default: return 'border-gray-400 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div 
        ref={inventoryRef}
        className="w-96 h-full bg-gradient-to-b from-purple-900 to-black text-white overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Inventory</h2>
            <button 
              onClick={handleClose}
              className="text-2xl hover:text-red-400 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Player Summary */}
        <div className="p-6 border-b border-purple-500">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
              {playerStats.level}
            </div>
            <h3 className="text-lg font-semibold">Level {playerStats.level} DeFi Explorer</h3>
            <div className="text-sm text-gray-400">
              {playerStats.xp} XP • {playerStats.tokens} tokens
            </div>
          </div>

          {/* Progress to next level */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Level {playerStats.level + 1}</span>
              <span>{playerStats.xp % 100}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(playerStats.xp % 100)}%` }}
              />
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-900 bg-opacity-50 p-3 rounded-lg">
              <div className="text-xs text-gray-400">Total Supplied</div>
              <div className="text-lg font-bold text-green-400">
                ${Object.values(playerStats.portfolio.supplied).reduce((sum, val) => sum + val, 0).toFixed(0)}
              </div>
            </div>
            <div className="bg-red-900 bg-opacity-50 p-3 rounded-lg">
              <div className="text-xs text-gray-400">Total Borrowed</div>
              <div className="text-lg font-bold text-red-400">
                ${Object.values(playerStats.portfolio.borrowed).reduce((sum, val) => sum + val, 0).toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Badges ({inventory.badges.length})
          </h3>
          
          {inventory.badges.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2">🎯</div>
              <p>No badges earned yet!</p>
              <p className="text-sm">Complete rooms to earn badges</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {inventory.badges.map((badge, index) => {
                const badgeInfo = BADGES[badge.name] || {
                  name: badge.name,
                  description: 'Achievement unlocked!',
                  icon: '🏅',
                  rarity: 'common'
                };
                
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${getBadgeRarityColor(badgeInfo.rarity)} text-black transition-transform hover:scale-105`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{badgeInfo.icon}</div>
                      <div className="font-semibold text-sm">{badgeInfo.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{badgeInfo.description}</div>
                      <div className="text-xs text-gray-500 mt-1 capitalize">{badgeInfo.rarity}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Knowledge Section */}
        <div className="p-6 border-t border-purple-500">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📚</span>
            Knowledge Gained
          </h3>
          
          {inventory.knowledge.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              <p>No knowledge entries yet!</p>
              <p className="text-sm">Learn DeFi concepts to build your knowledge base</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inventory.knowledge.map((knowledge, index) => (
                <div key={index} className="bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                  <div className="font-semibold text-sm">{knowledge.concept}</div>
                  <div className="text-xs text-gray-300 mt-1">{knowledge.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Power-ups Section */}
        <div className="p-6 border-t border-purple-500">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Power-ups ({inventory.powerUps.length})
          </h3>
          
          {inventory.powerUps.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              <p>No power-ups collected!</p>
              <p className="text-sm">Find power-ups in treasure chests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inventory.powerUps.map((powerUp, index) => (
                <div key={index} className="bg-yellow-900 bg-opacity-30 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm">{powerUp.name}</div>
                    <div className="text-xs text-gray-300">{powerUp.description}</div>
                  </div>
                  <button className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-xs font-semibold transition-colors">
                    Use
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Details */}
        <div className="p-6 border-t border-purple-500">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">💼</span>
            Portfolio Details
          </h3>
          
          {/* Health Factor */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm">Health Factor</span>
              <span className={`font-bold ${
                playerStats.portfolio.healthFactor > 2 ? 'text-green-400' :
                playerStats.portfolio.healthFactor > 1.5 ? 'text-yellow-400' :
                playerStats.portfolio.healthFactor > 1.1 ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {playerStats.portfolio.healthFactor === 999 ? '∞' : playerStats.portfolio.healthFactor.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {playerStats.portfolio.healthFactor < 1.3 && playerStats.portfolio.healthFactor !== 999 && 
                "⚠️ Low health factor - risk of liquidation!"
              }
            </div>
          </div>

          {/* Supplied Assets */}
          {Object.keys(playerStats.portfolio.supplied).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-green-400 mb-2">Supplied Assets</h4>
              {Object.entries(playerStats.portfolio.supplied).map(([token, amount]) => (
                <div key={token} className="flex justify-between text-sm py-1">
                  <span>{token}</span>
                  <span>{amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Borrowed Assets */}
          {Object.keys(playerStats.portfolio.borrowed).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-red-400 mb-2">Borrowed Assets</h4>
              {Object.entries(playerStats.portfolio.borrowed).map(([token, amount]) => (
                <div key={token} className="flex justify-between text-sm py-1">
                  <span>{token}</span>
                  <span>{amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="p-6 border-t border-purple-500">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Statistics
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Rooms Completed</span>
              <span>{inventory.badges.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total XP Earned</span>
              <span>{playerStats.xp}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Level</span>
              <span>{playerStats.level}</span>
            </div>
            <div className="flex justify-between">
              <span>Tokens Earned</span>
              <span>{playerStats.tokens}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySystem;
