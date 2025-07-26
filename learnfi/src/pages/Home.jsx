import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // State for trivia - using static content instead of AI
  const [trivia, setTrivia] = useState({
    fact: "Compound was one of the first DeFi protocols to introduce the concept of 'governance tokens' with COMP, allowing token holders to vote on protocol changes.",
    source: "DeFi Education"
  });
  
  // Static trivia facts
  const triviaFacts = [
    {
      fact: "Compound was one of the first DeFi protocols to introduce the concept of 'governance tokens' with COMP, allowing token holders to vote on protocol changes.",
      source: "DeFi Education"
    },
    {
      fact: "The Compound protocol automatically adjusts interest rates based on supply and demand, creating a dynamic market for lending and borrowing.",
      source: "DeFi Education"
    },
    {
      fact: "cTokens represent your share of the lending pool and accrue interest through an increasing exchange rate with the underlying asset.",
      source: "DeFi Education"
    },
    {
      fact: "Liquidation in Compound occurs when a borrower's health factor falls below 1.0, protecting the protocol from bad debt.",
      source: "DeFi Education"
    },
    {
      fact: "The total value locked (TVL) in Compound has exceeded $10 billion at its peak, making it one of the largest DeFi protocols.",
      source: "DeFi Education"
    }
  ];
  
  // Rotate trivia on component mount
  useEffect(() => {
    const randomTrivia = triviaFacts[Math.floor(Math.random() * triviaFacts.length)];
    setTrivia(randomTrivia);
  }, []);
  
  return (
    <div className="flex flex-col space-y-16">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center bg-white rounded-xl shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              LF
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LearnFi
          </h1>
          <p className="text-xl mb-8 text-gray-700">
            The Gamified DeFi Learning Playground
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/game" 
              className="btn btn-primary text-lg px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🎮 Play DeFi Dungeon
            </Link>
            <Link 
              to="/learn" 
              className="btn btn-primary text-lg px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Start Learning DeFi
            </Link>
            <Link 
              to="/simulate" 
              className="btn btn-secondary text-lg px-8 py-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
              Try Simulation
            </Link>
          </div>
        </div>
      </section>

      {/* Game Spotlight Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white rounded-xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🏰 Introducing DeFi Dungeon</h2>
            <p className="text-xl text-gray-300">
              The ultimate gamified DeFi learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Epic DeFi Adventure Awaits!</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚔️</span>
                  <span>Battle DeFi monsters using real Compound mechanics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧩</span>
                  <span>Solve complex puzzles to master lending & borrowing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏆</span>
                  <span>Earn badges and level up your DeFi knowledge</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💰</span>
                  <span>Manage your portfolio and avoid liquidation</span>
                </div>
              </div>
              
              <div className="mt-8">
                <Link 
                  to="/game" 
                  className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Start Your Quest
                </Link>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-black bg-opacity-30 p-8 rounded-xl">
                <div className="text-6xl mb-4">🧙‍♂️</div>
                <h4 className="text-xl font-bold mb-2">Become a DeFi Master</h4>
                <p className="text-gray-300 mb-4">
                  Journey through 10+ rooms, each teaching crucial DeFi concepts
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-800 p-3 rounded">
                    <div className="font-bold">Learn</div>
                    <div>Real DeFi Mechanics</div>
                  </div>
                  <div className="bg-blue-800 p-3 rounded">
                    <div className="font-bold">Practice</div>
                    <div>Risk-Free Environment</div>
                  </div>
                  <div className="bg-purple-800 p-3 rounded">
                    <div className="font-bold">Master</div>
                    <div>Advanced Strategies</div>
                  </div>
                  <div className="bg-yellow-800 p-3 rounded">
                    <div className="font-bold">Achieve</div>
                    <div>DeFi Mastery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How LearnFi Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">Learn DeFi Concepts</h3>
              <p className="text-gray-600">
                Explore interactive lessons with detailed explanations that make complex DeFi concepts easy to understand.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-xl font-semibold mb-2">Simulate Compound</h3>
              <p className="text-gray-600">
                Practice supplying and borrowing in a risk-free environment with animated visualizations of each action.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
              <p className="text-gray-600">
                Complete challenges and quizzes to earn badges and track your progress through your DeFi learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trivia Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="mr-2">💡</span> DeFi Trivia of the Day
            </h3>
            <p className="text-gray-700 mb-2">
              {trivia.fact}
            </p>
            <p className="text-sm text-gray-500">
              Source: {trivia.source}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
