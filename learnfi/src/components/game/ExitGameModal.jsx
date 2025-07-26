import React, { useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const ExitGameModal = ({ isOpen, onClose, playerStats, onConfirmExit }) => {
  const navigate = useNavigate();
  const [selectedPenalty, setSelectedPenalty] = useState('small');

  // Calculate penalty amounts based on player's current tokens
  const penalties = {
    small: {
      name: 'Quick Exit',
      cost: Math.min(50, Math.floor(playerStats.tokens * 0.1)),
      description: 'Pay 10% of tokens (min 50) to exit quickly',
      icon: '🚪',
      color: 'bg-yellow-600'
    },
    medium: {
      name: 'Standard Exit',
      cost: Math.min(100, Math.floor(playerStats.tokens * 0.15)),
      description: 'Pay 15% of tokens (min 100) for standard exit',
      icon: '🚶',
      color: 'bg-orange-600'
    },
    large: {
      name: 'Rage Quit',
      cost: Math.min(200, Math.floor(playerStats.tokens * 0.25)),
      description: 'Pay 25% of tokens (min 200) to rage quit',
      icon: '😤',
      color: 'bg-red-600'
    },
    free: {
      name: 'Complete Current Room',
      cost: 0,
      description: 'Finish your current challenge to exit for free',
      icon: '✅',
      color: 'bg-green-600'
    }
  };

  const handleExit = () => {
    const penalty = penalties[selectedPenalty];
    
    if (penalty.cost > playerStats.tokens && selectedPenalty !== 'free') {
      alert('Not enough tokens for this exit option!');
      return;
    }

    // Animate exit
    gsap.to('.exit-modal', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        onConfirmExit(penalty.cost);
        navigate('/');
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="exit-modal bg-gradient-to-b from-gray-800 to-black text-white rounded-xl p-8 max-w-md w-full mx-4 border-2 border-red-500">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400">Exit DeFi Dungeon?</h2>
          <p className="text-gray-300 mt-2">
            Leaving the dungeon early comes with consequences...
          </p>
        </div>

        {/* Player Stats */}
        <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Current Progress</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Level:</span>
              <span className="ml-2 font-bold">{playerStats.level}</span>
            </div>
            <div>
              <span className="text-gray-400">XP:</span>
              <span className="ml-2 font-bold">{playerStats.xp}</span>
            </div>
            <div>
              <span className="text-gray-400">Tokens:</span>
              <span className="ml-2 font-bold text-yellow-400">{playerStats.tokens}</span>
            </div>
            <div>
              <span className="text-gray-400">Health:</span>
              <span className="ml-2 font-bold text-green-400">{playerStats.health}/100</span>
            </div>
          </div>
        </div>

        {/* Exit Options */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Choose Your Exit Strategy:</h3>
          <div className="space-y-3">
            {Object.entries(penalties).map(([key, penalty]) => (
              <button
                key={key}
                onClick={() => setSelectedPenalty(key)}
                disabled={penalty.cost > playerStats.tokens && key !== 'free'}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPenalty === key
                    ? 'border-blue-400 bg-blue-700'
                    : penalty.cost > playerStats.tokens && key !== 'free'
                    ? 'border-gray-600 bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{penalty.icon}</span>
                    <div>
                      <div className="font-semibold">{penalty.name}</div>
                      <div className="text-sm text-gray-300">{penalty.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-400">
                      {penalty.cost === 0 ? 'FREE' : `-${penalty.cost} tokens`}
                    </div>
                    {penalty.cost > playerStats.tokens && key !== 'free' && (
                      <div className="text-xs text-red-400">Not enough tokens</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-red-400 text-lg">⚠️</span>
            <div className="text-red-300 text-sm">
              <strong>Warning:</strong> Exiting early will cost you tokens and you'll lose any progress in your current room. 
              Your overall game progress and badges will be saved.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Stay in Dungeon
          </button>
          <button
            onClick={handleExit}
            disabled={penalties[selectedPenalty].cost > playerStats.tokens && selectedPenalty !== 'free'}
            className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Exit Game
          </button>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            💡 <em>Remember: Every great DeFi master faced challenges. Don't give up!</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitGameModal;
