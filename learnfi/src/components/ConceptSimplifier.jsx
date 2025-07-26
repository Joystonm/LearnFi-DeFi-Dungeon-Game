import React, { useState } from 'react';

const ConceptSimplifier = ({ concept, initialDifficulty = 'intermediate' }) => {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Difficulty levels
  const difficultyLevels = [
    { id: 'beginner', label: 'Beginner', description: 'Simple explanations with everyday analogies' },
    { id: 'intermediate', label: 'Intermediate', description: 'More technical details with some DeFi terminology' },
    { id: 'advanced', label: 'Advanced', description: 'In-depth explanations with technical concepts' }
  ];
  
  // Static explanations for different concepts and difficulty levels
  const staticExplanations = {
    'Collateral Factor': {
      beginner: 'Think of collateral factor like a safety deposit. If you want to borrow money from a bank, you need to put up something valuable as security. In DeFi, when you supply tokens to Compound, they become your collateral. The collateral factor (like 75%) means you can only borrow up to 75% of what you supplied. This protects the protocol if prices drop.',
      intermediate: 'Collateral factor is a risk parameter that determines how much you can borrow against your supplied assets. Each asset has a different collateral factor based on its volatility and liquidity. For example, ETH might have a 75% collateral factor, meaning you can borrow up to $750 for every $1000 of ETH you supply. This creates a safety buffer for the protocol.',
      advanced: 'The collateral factor is a protocol-level risk parameter that represents the maximum loan-to-value ratio for each asset. It\'s determined by governance based on the asset\'s volatility, liquidity, and market depth. The collateral factor directly impacts the health factor calculation: Health Factor = (Collateral Value × Collateral Factor) / Borrowed Value. Values are typically set between 0-90%, with more volatile assets having lower factors.'
    },
    'Health Factor': {
      beginner: 'Your health factor is like a safety score that shows how safe your borrowed money is. If it goes below 1.0, you\'re in danger of losing your collateral (liquidation). Think of it like a car\'s fuel gauge - you want to keep it well above empty to avoid getting stranded.',
      intermediate: 'Health factor measures your position\'s safety by comparing your collateral value to your borrowed amount. It\'s calculated as (Collateral × Collateral Factor) / Borrowed Amount. A health factor above 1.0 means you\'re safe, while below 1.0 means you can be liquidated. Most users try to keep it above 1.5 for safety.',
      advanced: 'The health factor is a normalized metric representing the safety of your leveraged position. It\'s calculated as the weighted average of your collateral (adjusted by each asset\'s collateral factor) divided by your total borrowed value. When HF < 1.0, the position becomes undercollateralized and eligible for liquidation. The liquidation threshold and penalty are protocol parameters that incentivize liquidators to maintain system solvency.'
    },
    'cTokens': {
      beginner: 'cTokens are like receipts you get when you lend money to Compound. When you supply 100 DAI, you get cDAI tokens in return. These cTokens slowly grow in value as you earn interest. When you want your money back, you exchange your cTokens for the original tokens plus the interest you earned.',
      intermediate: 'cTokens represent your share of the lending pool in Compound. When you supply assets, you receive cTokens that accrue interest over time through an increasing exchange rate. For example, 1 cDAI might be worth 1.05 DAI after some time due to earned interest. cTokens can also be used as collateral for borrowing.',
      advanced: 'cTokens are ERC-20 tokens that represent a user\'s balance in a Compound money market. They implement a rebasing mechanism where the exchange rate between cTokens and underlying tokens increases over time based on the market\'s interest rate. The exchange rate is calculated as: (totalCash + totalBorrows - totalReserves) / totalSupply. This allows for composability while maintaining accurate interest accrual.'
    }
  };
  
  // Get explanation based on difficulty
  const getExplanation = async (selectedDifficulty) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use static explanations instead of AI
      const conceptExplanations = staticExplanations[concept];
      if (conceptExplanations && conceptExplanations[selectedDifficulty]) {
        setExplanation(conceptExplanations[selectedDifficulty]);
      } else {
        setExplanation(`This is a ${selectedDifficulty} level explanation of ${concept}. This concept is important in DeFi and helps you understand how decentralized finance protocols work.`);
      }
    } catch (error) {
      console.error('Error getting explanation:', error);
      setError('Failed to get explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    getExplanation(newDifficulty);
  };
  
  // Load explanation on mount
  React.useEffect(() => {
    if (concept) {
      getExplanation(difficulty);
    }
  }, [concept, difficulty]);
  
  // Get difficulty color
  const getDifficultyColor = (difficultyId) => {
    switch (difficultyId) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🔍</span>
          Concept Simplifier: {concept}
        </h3>
      </div>
      
      {/* Difficulty Selector */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Choose your level:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {difficultyLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleDifficultyChange(level.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                difficulty === level.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{level.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(level.id)}`}>
                  {level.id}
                </span>
              </div>
              <p className="text-sm text-gray-600">{level.description}</p>
            </button>
          ))}
        </div>
      </div>
      
      {/* Explanation */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-2">Explanation ({difficulty} level):</h4>
        
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Getting explanation...</span>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        {explanation && !isLoading && !error && (
          <div className="text-gray-700 leading-relaxed">
            {explanation}
          </div>
        )}
      </div>
      
      {/* Additional Resources */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-2">Want to learn more?</h4>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors">
            📚 Read Documentation
          </button>
          <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors">
            🧪 Try Simulation
          </button>
          <button className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors">
            🎮 Play DeFi Dungeon
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptSimplifier;
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🔍</span> Concept Simplifier
        </h2>
        <p className="text-sm text-blue-100">
          Adjust the difficulty level to understand concepts at your own pace
        </p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{concept}</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {difficultyLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleDifficultyChange(level.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  difficulty === level.id
                    ? getDifficultyColor(level.id)
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
          
          <p className="text-sm text-gray-500 italic mb-4">
            {difficultyLevels.find(level => level.id === difficulty)?.description}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="prose max-w-none">
            <div className={`p-4 rounded-lg ${
              difficulty === 'beginner' ? 'bg-green-50' :
              difficulty === 'intermediate' ? 'bg-blue-50' :
              'bg-purple-50'
            }`}>
              <p className="whitespace-pre-line">{explanation}</p>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Not clear enough? Try adjusting the difficulty level.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConceptSimplifier;
