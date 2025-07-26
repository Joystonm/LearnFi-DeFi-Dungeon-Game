import React, { useState } from 'react';
import { gsap } from 'gsap';

const RoomExitModal = ({ isOpen, onClose, onConfirmExit, playerStats, currentRoom }) => {
  const [selectedPenalty, setSelectedPenalty] = useState('small');

  // Calculate penalty amounts for leaving a room mid-challenge
  const penalties = {
    small: {
      name: 'Quick Retreat',
      cost: Math.min(25, Math.floor(playerStats.tokens * 0.05)),
      description: 'Pay 5% of tokens (min 25) to retreat quickly',
      icon: '🏃',
      color: 'bg-yellow-600'
    },
    medium: {
      name: 'Strategic Withdrawal',
      cost: Math.min(50, Math.floor(playerStats.tokens * 0.08)),
      description: 'Pay 8% of tokens (min 50) for strategic exit',
      icon: '🚶',
      color: 'bg-orange-600'
    },
    large: {
      name: 'Emergency Exit',
      cost: Math.min(100, Math.floor(playerStats.tokens * 0.12)),
      description: 'Pay 12% of tokens (min 100) for emergency exit',
      icon: '🚨',
      color: 'bg-red-600'
    }
  };

  const handleExit = () => {
    const penalty = penalties[selectedPenalty];
    
    if (penalty.cost > playerStats.tokens) {
      alert('Not enough tokens for this exit option!');
      return;
    }

    // Animate exit
    gsap.to('.room-exit-modal', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        onConfirmExit(penalty.cost);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="room-exit-modal bg-gradient-to-b from-gray-800 to-black text-white rounded-xl p-6 max-w-md w-full mx-4 border-2 border-orange-500">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🚪</div>
          <h2 className="text-2xl font-bold text-orange-400">Exit Room {currentRoom}?</h2>
          <p className="text-gray-300 mt-2">
            Leaving mid-challenge will cost you some coins...
          </p>
        </div>

        {/* Current Room Info */}
        <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Current Progress</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Room:</span>
              <span className="ml-2 font-bold">#{currentRoom}</span>
            </div>
            <div>
              <span className="text-gray-400">Tokens:</span>
              <span className="ml-2 font-bold text-yellow-400">{playerStats.tokens}</span>
            </div>
            <div>
              <span className="text-gray-400">Health:</span>
              <span className="ml-2 font-bold text-green-400">{playerStats.health}/100</span>
            </div>
            <div>
              <span className="text-gray-400">Level:</span>
              <span className="ml-2 font-bold">{playerStats.level}</span>
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
                disabled={penalty.cost > playerStats.tokens}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPenalty === key
                    ? 'border-orange-400 bg-orange-700'
                    : penalty.cost > playerStats.tokens
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
                      -{penalty.cost} 🪙
                    </div>
                    {penalty.cost > playerStats.tokens && (
                      <div className="text-xs text-red-400">Not enough tokens</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-orange-900 bg-opacity-50 border border-orange-500 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-orange-400 text-lg">⚠️</span>
            <div className="text-orange-300 text-sm">
              <strong>Note:</strong> Exiting mid-room will return you to the dungeon map. 
              Your room progress will be lost, but overall game progress remains saved.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Stay & Fight
          </button>
          <button
            onClick={handleExit}
            disabled={penalties[selectedPenalty].cost > playerStats.tokens}
            className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Exit Room
          </button>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            💪 <em>Every challenge is a chance to learn something new!</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomExitModal;
