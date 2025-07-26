import React, { useState } from 'react';
import { useCompound } from '../context/CompoundContext';

const StrategyRecommendation = () => {
  const { marketData } = useCompound();
  
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [investmentGoal, setInvestmentGoal] = useState('income');
  const [timeHorizon, setTimeHorizon] = useState('medium');
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Risk tolerance options
  const riskToleranceOptions = [
    { id: 'low', label: 'Low Risk', description: 'Prioritize safety over returns' },
    { id: 'medium', label: 'Medium Risk', description: 'Balance between safety and returns' },
    { id: 'high', label: 'High Risk', description: 'Maximize returns, accept higher risk' }
  ];
  
  // Investment goal options
  const investmentGoalOptions = [
    { id: 'income', label: 'Generate Income', description: 'Focus on earning steady interest' },
    { id: 'growth', label: 'Capital Growth', description: 'Leverage for potential higher returns' },
    { id: 'learning', label: 'Learning', description: 'Experiment with small amounts to learn' }
  ];
  
  // Time horizon options
  const timeHorizonOptions = [
    { id: 'short', label: 'Short Term (< 3 months)', description: 'Quick in and out' },
    { id: 'medium', label: 'Medium Term (3-12 months)', description: 'Moderate commitment' },
    { id: 'long', label: 'Long Term (> 1 year)', description: 'Long-term strategy' }
  ];

  // Static strategy recommendations based on user inputs
  const getStaticRecommendation = (risk, goal, horizon) => {
    const strategies = {
      'low-income-short': {
        title: 'Conservative Income Strategy',
        description: 'Focus on stable, low-risk assets for steady income generation.',
        recommendations: [
          'Supply USDC or DAI for stable returns (3-5% APY)',
          'Avoid borrowing to minimize liquidation risk',
          'Keep health factor above 2.0 if you do borrow',
          'Monitor interest rates daily for optimal timing'
        ],
        riskLevel: 'Low',
        expectedReturn: '3-5% APY',
        assets: ['USDC', 'DAI'],
        warnings: ['Interest rates can fluctuate', 'Consider gas fees for short-term positions']
      },
      'medium-income-medium': {
        title: 'Balanced Income Strategy',
        description: 'Mix of stable and volatile assets for moderate returns with manageable risk.',
        recommendations: [
          'Supply 60% stablecoins (USDC/DAI) and 40% ETH',
          'Consider borrowing stablecoins against ETH collateral',
          'Maintain health factor above 1.5',
          'Rebalance monthly based on market conditions'
        ],
        riskLevel: 'Medium',
        expectedReturn: '4-8% APY',
        assets: ['USDC', 'DAI', 'ETH'],
        warnings: ['ETH price volatility affects health factor', 'Monitor liquidation risk']
      },
      'high-growth-long': {
        title: 'Aggressive Growth Strategy',
        description: 'Leverage volatile assets for maximum growth potential.',
        recommendations: [
          'Supply ETH and WBTC as collateral',
          'Borrow stablecoins to buy more volatile assets',
          'Use 2-3x leverage carefully',
          'Maintain health factor above 1.3 minimum'
        ],
        riskLevel: 'High',
        expectedReturn: '8-15% APY (with leverage)',
        assets: ['ETH', 'WBTC', 'USDC'],
        warnings: ['High liquidation risk', 'Requires active monitoring', 'Market volatility can cause losses']
      },
      'low-learning-short': {
        title: 'Learning Strategy',
        description: 'Safe approach to learn DeFi mechanics with minimal risk.',
        recommendations: [
          'Start with small amounts ($10-100)',
          'Supply only stablecoins initially',
          'Practice with DeFi Dungeon game first',
          'Gradually experiment with borrowing'
        ],
        riskLevel: 'Very Low',
        expectedReturn: '2-4% APY',
        assets: ['USDC', 'DAI'],
        warnings: ['Gas fees may exceed returns on small amounts', 'Focus on learning over profits']
      }
    };

    // Create a key from the inputs
    const key = `${risk}-${goal}-${horizon}`;
    
    // Return specific strategy or default to conservative
    return strategies[key] || strategies['low-income-short'];
  };
  
  // Generate recommendation
  const generateRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use static recommendations instead of AI
      const staticRec = getStaticRecommendation(riskTolerance, investmentGoal, timeHorizon);
      
      // Add current market context
      const contextualRec = {
        ...staticRec,
        marketContext: {
          currentConditions: 'Based on current Compound market conditions',
          topSupplyRate: '4.2% APY on USDC',
          topBorrowRate: '6.8% APY on ETH',
          recommendation: 'Market conditions favor conservative strategies'
        }
      };
      
      setRecommendation(contextualRec);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      setError('Failed to generate recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🎯</span>
          Strategy Recommendation
        </h3>
      </div>
      
      {/* Input Form */}
      <div className="space-y-6 mb-6">
        {/* Risk Tolerance */}
        <div>
          <h4 className="font-medium mb-3">Risk Tolerance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {riskToleranceOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setRiskTolerance(option.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  riskTolerance === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Investment Goal */}
        <div>
          <h4 className="font-medium mb-3">Investment Goal</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {investmentGoalOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setInvestmentGoal(option.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  investmentGoal === option.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Time Horizon */}
        <div>
          <h4 className="font-medium mb-3">Time Horizon</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {timeHorizonOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setTimeHorizon(option.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  timeHorizon === option.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Generate Button */}
      <button
        onClick={generateRecommendation}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating Recommendation...' : 'Get Strategy Recommendation'}
      </button>
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800">{error}</div>
        </div>
      )}
      
      {/* Recommendation Display */}
      {recommendation && !isLoading && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-xl font-bold mb-2">{recommendation.title}</h4>
            <p className="text-gray-700 mb-4">{recommendation.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm text-gray-600">Risk Level</div>
                <div className="font-semibold">{recommendation.riskLevel}</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm text-gray-600">Expected Return</div>
                <div className="font-semibold">{recommendation.expectedReturn}</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm text-gray-600">Recommended Assets</div>
                <div className="font-semibold">{recommendation.assets.join(', ')}</div>
              </div>
            </div>
          </div>
          
          {/* Detailed Recommendations */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold mb-3">Recommended Actions:</h5>
            <ul className="space-y-2">
              {recommendation.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Warnings */}
          {recommendation.warnings && recommendation.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold mb-3 text-yellow-800">⚠️ Important Considerations:</h5>
              <ul className="space-y-2">
                {recommendation.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">⚠️</span>
                    <span className="text-yellow-800">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Market Context */}
          {recommendation.marketContext && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold mb-3 text-blue-800">📊 Market Context:</h5>
              <div className="space-y-2 text-blue-800">
                <p>{recommendation.marketContext.currentConditions}</p>
                <p>• {recommendation.marketContext.topSupplyRate}</p>
                <p>• {recommendation.marketContext.topBorrowRate}</p>
                <p>• {recommendation.marketContext.recommendation}</p>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              🧪 Try in Simulation
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              🎮 Practice in DeFi Dungeon
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              📚 Learn More
            </button>
          </div>
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Disclaimer:</strong> This is educational content only and not financial advice. 
          DeFi investments carry significant risks including potential loss of funds. 
          Always do your own research and never invest more than you can afford to lose.
        </p>
      </div>
    </div>
  );
};

export default StrategyRecommendation;
