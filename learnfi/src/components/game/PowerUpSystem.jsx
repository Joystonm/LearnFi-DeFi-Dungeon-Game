import React, { useState } from 'react';
import { gsap } from 'gsap';
import { POWER_UPS } from '../../data/gameData';

const PowerUpSystem = ({ playerStats, inventory, onUsePowerUp, onClose }) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState(null);

  const handleUsePowerUp = (powerUpId) => {
    const powerUp = POWER_UPS[powerUpId];
    if (!powerUp) return;

    // Check if player has this power-up
    const playerPowerUp = inventory.powerUps.find(p => p.id === powerUpId);
    if (!playerPowerUp || playerPowerUp.quantity <= 0) {
      alert('You don\'t have this power-up!');
      return;
    }

    // Animate power-up usage
    gsap.to(`.powerup-${powerUpId}`, {
      scale: 1.2,
      rotation: 360,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        onUsePowerUp(powerUpId);
        setSelectedPowerUp(null);
      }
    });
  };

  const getRarityColor = (rarity) => {
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
    <div className="bg-gradient-to-b from-purple-900 to-black text-white p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="mr-2">⚡</span>
          Power-Up Arsenal
        </h2>
        <button 
          onClick={onClose}
          className="text-2xl hover:text-red-400 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Active Effects */}
      {playerStats.activeEffects && playerStats.activeEffects.length > 0 && (
        <div className="mb-6 p-4 bg-green-900 bg-opacity-50 rounded-lg">
          <h3 className="font-semibold mb-2 text-green-400">🔥 Active Effects</h3>
          <div className="space-y-2">
            {playerStats.activeEffects.map((effect, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{effect.name}</span>
                <span className="text-green-300">{effect.duration} turns left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Power-Up Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {inventory.powerUps.map((playerPowerUp, index) => {
          const powerUp = POWER_UPS[playerPowerUp.id];
          if (!powerUp) return null;

          return (
            <div
              key={index}
              className={`powerup-${playerPowerUp.id} p-4 rounded-lg border-2 ${getRarityColor(powerUp.rarity)} text-black transition-transform hover:scale-105 cursor-pointer`}
              onClick={() => setSelectedPowerUp(playerPowerUp.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{powerUp.icon}</span>
                  <div>
                    <div className="font-semibold">{powerUp.name}</div>
                    <div className="text-xs text-gray-600 capitalize">{powerUp.rarity}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">x{playerPowerUp.quantity}</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{powerUp.description}</p>
              
              {selectedPowerUp === playerPowerUp.id && (
                <div className="space-y-2">
                  <div className="bg-white bg-opacity-50 p-2 rounded text-xs">
                    <strong>Effect:</strong> {JSON.stringify(powerUp.effect)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUsePowerUp(playerPowerUp.id);
                    }}
                    disabled={playerPowerUp.quantity <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 text-white py-2 px-4 rounded font-semibold transition-colors"
                  >
                    Use Power-Up
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {inventory.powerUps.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No Power-Ups Yet</h3>
          <p className="text-gray-400">
            Complete rooms and find treasure chests to collect power-ups!
          </p>
        </div>
      )}

      {/* Power-Up Shop Preview */}
      <div className="border-t border-gray-600 pt-6">
        <h3 className="font-semibold mb-4">💰 Available Power-Ups</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(POWER_UPS).slice(0, 4).map(([id, powerUp]) => (
            <div key={id} className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{powerUp.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{powerUp.name}</div>
                    <div className="text-xs text-gray-400">{powerUp.description}</div>
                  </div>
                </div>
                <div className="text-yellow-400 font-bold text-sm">
                  {powerUp.cost} 🪙
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            💡 Find power-ups in treasure rooms or earn them through achievements!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PowerUpSystem;
