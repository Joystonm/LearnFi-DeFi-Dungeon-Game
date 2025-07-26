import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const GameHUD = ({ playerStats, currentRoom, gameState }) => {
  const navigate = useNavigate();
  const hudRef = useRef(null);
  const healthBarRef = useRef(null);
  const xpBarRef = useRef(null);

  useEffect(() => {
    // Animate HUD entrance
    gsap.fromTo(hudRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    // Animate health bar changes
    if (healthBarRef.current) {
      gsap.to(healthBarRef.current, {
        width: `${playerStats.health}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [playerStats.health]);

  useEffect(() => {
    // Animate XP bar changes
    if (xpBarRef.current) {
      const xpProgress = (playerStats.xp % 100) / 100 * 100;
      gsap.to(xpBarRef.current, {
        width: `${xpProgress}%`,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }, [playerStats.xp]);

  const getHealthColor = () => {
    if (playerStats.health > 70) return 'bg-green-500';
    if (playerStats.health > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthFactorColor = () => {
    if (playerStats.portfolio.healthFactor > 2) return 'text-green-400';
    if (playerStats.portfolio.healthFactor > 1.5) return 'text-yellow-400';
    if (playerStats.portfolio.healthFactor > 1.1) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  return (
    <div ref={hudRef} className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 border-b border-purple-500">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left side - Player stats */}
          <div className="flex items-center space-x-6">
            
            {/* Player avatar and level */}
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                {playerStats.level}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Level {playerStats.level}</div>
                <div className="text-xs text-gray-400">DeFi Explorer</div>
              </div>
            </div>

            {/* Health bar */}
            <div className="flex items-center space-x-2">
              <span className="text-red-400 text-lg">❤️</span>
              <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  ref={healthBarRef}
                  className={`h-full ${getHealthColor()} transition-all duration-500`}
                  style={{ width: `${playerStats.health}%` }}
                />
              </div>
              <span className="text-sm text-white">{playerStats.health}/100</span>
            </div>

            {/* XP bar */}
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 text-lg">⭐</span>
              <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  ref={xpBarRef}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-800"
                  style={{ width: `${(playerStats.xp % 100)}%` }}
                />
              </div>
              <span className="text-sm text-white">{playerStats.xp % 100}/100</span>
            </div>

            {/* Tokens */}
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-lg">🪙</span>
              <span className="text-sm text-white font-semibold">{formatNumber(playerStats.tokens)}</span>
            </div>
          </div>

          {/* Center - Current room info */}
          <div className="text-center">
            <div className="text-lg font-bold text-white">Room {currentRoom}</div>
            <div className="text-sm text-gray-400 capitalize">{gameState.replace('_', ' ')}</div>
          </div>

          {/* Right side - Portfolio stats and Return button */}
          <div className="flex items-center space-x-6">
            
            {/* Return to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <span>🏠</span>
              <span>Home</span>
            </button>
            
            {/* Health Factor */}
            <div className="text-center">
              <div className="text-xs text-gray-400">Health Factor</div>
              <div className={`text-lg font-bold ${getHealthFactorColor()}`}>
                {playerStats.portfolio.healthFactor === 999 ? '∞' : playerStats.portfolio.healthFactor.toFixed(2)}
              </div>
            </div>

            {/* Total Supplied */}
            <div className="text-center">
              <div className="text-xs text-gray-400">Supplied</div>
              <div className="text-sm text-green-400 font-semibold">
                ${formatNumber(Object.values(playerStats.portfolio.supplied).reduce((sum, val) => sum + val, 0))}
              </div>
            </div>

            {/* Total Borrowed */}
            <div className="text-center">
              <div className="text-xs text-gray-400">Borrowed</div>
              <div className="text-sm text-red-400 font-semibold">
                ${formatNumber(Object.values(playerStats.portfolio.borrowed).reduce((sum, val) => sum + val, 0))}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio breakdown (expandable) */}
        {(Object.keys(playerStats.portfolio.supplied).length > 0 || Object.keys(playerStats.portfolio.borrowed).length > 0) && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="flex justify-between text-xs">
              
              {/* Supplied assets */}
              <div className="flex space-x-4">
                <span className="text-gray-400">Supplied:</span>
                {Object.entries(playerStats.portfolio.supplied).map(([token, amount]) => (
                  <span key={token} className="text-green-400">
                    {amount.toFixed(2)} {token}
                  </span>
                ))}
              </div>

              {/* Borrowed assets */}
              <div className="flex space-x-4">
                <span className="text-gray-400">Borrowed:</span>
                {Object.entries(playerStats.portfolio.borrowed).map(([token, amount]) => (
                  <span key={token} className="text-red-400">
                    {amount.toFixed(2)} {token}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Warning indicators */}
        {playerStats.portfolio.healthFactor < 1.3 && playerStats.portfolio.healthFactor !== 999 && (
          <div className="mt-2 p-2 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-red-400 text-lg">⚠️</span>
              <span className="text-red-400 text-sm font-semibold">
                Warning: Low Health Factor! Risk of liquidation!
              </span>
            </div>
          </div>
        )}

        {playerStats.health < 30 && (
          <div className="mt-2 p-2 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-red-400 text-lg">💀</span>
              <span className="text-red-400 text-sm font-semibold">
                Critical Health! Find a way to recover!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHUD;
