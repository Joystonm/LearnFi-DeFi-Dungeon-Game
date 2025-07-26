import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import GameEngine from '../components/game/GameEngine';

const DeFiDungeon = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if player has existing save
    const savedProgress = localStorage.getItem('defi-dungeon-progress');
    if (savedProgress) {
      setShowIntro(false);
    }

    // Set viewport height for mobile
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Update on resize
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startNewGame = () => {
    // Clear any existing save
    localStorage.removeItem('defi-dungeon-progress');
    
    // Start game animation
    gsap.to('.intro-screen', {
      opacity: 0,
      y: -50,
      duration: 0.5,
      onComplete: () => setGameStarted(true)
    });
  };

  const continueGame = () => {
    gsap.to('.intro-screen', {
      opacity: 0,
      y: -50,
      duration: 0.5,
      onComplete: () => setGameStarted(true)
    });
  };

  if (gameStarted) {
    return <GameEngine />;
  }

  return (
    <div className="game-container min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white overflow-y-auto"
         style={{ height: 'calc(var(--vh, 1vh) * 100)', minHeight: '-webkit-fill-available' }}>
      <div className="intro-screen container mx-auto px-4 py-8 flex flex-col justify-center" 
           style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        {/* Game intro section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            DeFi Dungeon
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Master DeFi through an epic dungeon adventure!
          </p>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-800 bg-opacity-50 p-4 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-lg font-semibold mb-1">Learn by Playing</h3>
            <p className="text-sm text-gray-300">Master DeFi concepts through interactive gameplay</p>
          </div>
          
          <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-semibold mb-1">Real DeFi Mechanics</h3>
            <p className="text-sm text-gray-300">Practice with actual Compound Protocol calculations</p>
          </div>
          
          <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg">
            <div className="text-3xl mb-2">🏅</div>
            <h3 className="text-lg font-semibold mb-1">Track Progress</h3>
            <p className="text-sm text-gray-300">Monitor your learning journey and achievements</p>
          </div>

          <div className="bg-yellow-800 bg-opacity-50 p-4 rounded-lg">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-lg font-semibold mb-1">Power-Up System</h3>
            <p className="text-sm text-gray-300">Collect and use power-ups to enhance your abilities</p>
          </div>
        </div>

        {/* Start Game Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <button
            onClick={startNewGame}
            className="w-64 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105"
          >
            🎮 Start New Game
          </button>
          
          {!showIntro && (
            <button
              onClick={continueGame}
              className="w-64 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105"
            >
              ⚡ Continue Adventure
            </button>
          )}
        </div>

        {/* Game Stats */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            🏰 15+ Dungeon Rooms | 🎓 Real DeFi Learning | 🏆 Achievement System
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeFiDungeon;
