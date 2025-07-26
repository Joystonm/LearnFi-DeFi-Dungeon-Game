import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const ScenarioQuestion = ({ onComplete }) => {
  const { addBadge } = useUser();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  // Scenario-based questions
  const scenarios = [
    {
      id: 'scenario1',
      title: 'Market Volatility Scenario',
      description: 'You have supplied 10 ETH (worth $3,000 each) as collateral and borrowed 15,000 USDC. The collateral factor for ETH is 75%.',
      question: 'What would happen if the price of ETH suddenly drops to $2,500?',
      options: [
        {
          id: 'a',
          text: 'Nothing would happen, your position is still safe',
          correct: true,
          explanation: 'Your collateral value would be 10 ETH × $2,500 = $25,000. With a 75% collateral factor, your maximum borrow would be $25,000 × 0.75 = $18,750, which is still above your borrowed amount of $15,000.'
        },
        {
          id: 'b',
          text: 'Your position would be partially liquidated',
          correct: false,
          explanation: 'Liquidation would only occur if your borrowed amount exceeds your maximum borrow limit. In this case, your maximum borrow limit ($18,750) is still above your borrowed amount ($15,000).'
        },
        {
          id: 'c',
          text: 'You would need to immediately repay some of your loan',
          correct: false,
          explanation: 'While it\'s always good practice to maintain a safe buffer, in this scenario your position is still overcollateralized and not at immediate risk of liquidation.'
        },
        {
          id: 'd',
          text: 'The protocol would automatically add more collateral to your position',
          correct: false,
          explanation: 'Compound does not automatically add collateral to positions. Managing collateral is the responsibility of the user.'
        }
      ]
    },
    {
      id: 'scenario2',
      title: 'Interest Rate Fluctuation',
      description: 'You notice that the supply APY for DAI has increased from 2% to 8% over the past week.',
      question: 'What is the most likely explanation for this change?',
      options: [
        {
          id: 'a',
          text: 'The Compound governance voted to increase interest rates',
          correct: false,
          explanation: 'While governance can adjust parameters of the interest rate model, sudden APY changes are typically driven by market dynamics rather than governance decisions.'
        },
        {
          id: 'b',
          text: 'There has been an increase in demand for borrowing DAI',
          correct: true,
          explanation: 'Correct! When demand for borrowing an asset increases, the utilization rate rises, which causes the interest rate model to increase both supply and borrow rates.'
        },
        {
          id: 'c',
          text: 'The price of DAI has increased significantly',
          correct: false,
          explanation: 'DAI is a stablecoin designed to maintain a value close to $1. Price fluctuations of DAI do not directly affect the interest rates in Compound.'
        },
        {
          id: 'd',
          text: 'The total supply of DAI in Compound has decreased',
          correct: false,
          explanation: 'While a decrease in supply could contribute to higher utilization and thus higher rates, this alone is not the most likely explanation. The primary driver would be increased borrowing demand.'
        }
      ]
    },
    {
      id: 'scenario3',
      title: 'Liquidation Risk Management',
      description: 'You have supplied 5 ETH (worth $3,000 each) and 10,000 USDC as collateral. You\'ve borrowed 10,000 DAI. The collateral factor for ETH is 75% and for USDC is 80%.',
      question: 'Which action would most effectively reduce your liquidation risk?',
      options: [
        {
          id: 'a',
          text: 'Supply an additional 5,000 USDC as collateral',
          correct: false,
          explanation: 'While adding more collateral would help, USDC has a collateral factor of 80%, so 5,000 USDC would only add $4,000 to your borrowing capacity.'
        },
        {
          id: 'b',
          text: 'Repay 5,000 DAI of your loan',
          correct: true,
          explanation: 'Correct! Reducing your borrowed amount directly decreases your liquidation risk by increasing the buffer between your borrowed amount and maximum borrow limit.'
        },
        {
          id: 'c',
          text: 'Convert your USDC collateral to ETH',
          correct: false,
          explanation: 'Converting USDC (80% collateral factor) to ETH (75% collateral factor) would actually reduce your borrowing capacity and potentially increase liquidation risk.'
        },
        {
          id: 'd',
          text: 'Borrow an additional 5,000 USDC',
          correct: false,
          explanation: 'Borrowing more would increase your debt and liquidation risk, not reduce it.'
        }
      ]
    }
  ];
  
  // Handle answer selection
  const handleAnswerSelect = (scenarioId, answerId) => {
    setAnswers({
      ...answers,
      [scenarioId]: answerId
    });
    setShowFeedback(true);
    
    // Check if answer is correct and update score
    const scenario = scenarios.find(s => s.id === scenarioId);
    const selectedOption = scenario.options.find(o => o.id === answerId);
    
    if (selectedOption.correct) {
      setScore(score + 1);
    }
  };
  
  // Move to next scenario
  const handleNextScenario = () => {
    setShowFeedback(false);
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      // All scenarios completed
      setShowResults(true);
      
      // Award badge if score is good enough
      if (score >= Math.ceil(scenarios.length * 0.7)) {
        const badge = {
          id: 'scenario_master',
          name: 'Scenario Master',
          type: 'achievement',
          description: 'Successfully analyzed complex DeFi scenarios'
        };
        
        addBadge(badge);
      }
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete({
          score,
          totalScenarios: scenarios.length,
          passed: score >= Math.ceil(scenarios.length * 0.7)
        });
      }
    }
  };
  
  // Restart scenarios
  const handleRestart = () => {
    setCurrentScenario(0);
    setAnswers({});
    setShowFeedback(false);
    setShowResults(false);
    setScore(0);
  };
  
  // Get current scenario
  const currentScenarioData = scenarios[currentScenario];
  
  // Get selected answer for current scenario
  const selectedAnswerId = answers[currentScenarioData.id];
  const selectedAnswer = selectedAnswerId 
    ? currentScenarioData.options.find(o => o.id === selectedAnswerId)
    : null;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🧩</span> DeFi Scenario Analysis
        </h2>
        <p className="text-sm text-yellow-100">
          Apply your knowledge to real-world DeFi scenarios
        </p>
      </div>
      
      <div className="p-6">
        {showResults ? (
          <div className="text-center">
            <div className={`inline-block p-4 rounded-full mb-4 ${
              score >= Math.ceil(scenarios.length * 0.7)
                ? 'bg-green-100'
                : 'bg-yellow-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${
                score >= Math.ceil(scenarios.length * 0.7)
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {score >= Math.ceil(scenarios.length * 0.7) ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">
              {score >= Math.ceil(scenarios.length * 0.7)
                ? 'Excellent Analysis!'
                : 'Scenarios Completed'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              You correctly analyzed {score} out of {scenarios.length} scenarios.
            </p>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    score >= Math.ceil(scenarios.length * 0.7)
                      ? 'bg-green-600'
                      : 'bg-yellow-600'
                  }`}
                  style={{ width: `${(score / scenarios.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{scenarios.length}</span>
              </div>
            </div>
            
            {score >= Math.ceil(scenarios.length * 0.7) ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  You've earned the "Scenario Master" badge for your excellent analysis skills!
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  You need to correctly analyze at least {Math.ceil(scenarios.length * 0.7)} out of {scenarios.length} scenarios to earn the badge. Try again!
                </p>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
              
              <button
                onClick={() => {
                  // Logic to continue to next activity
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Scenario {currentScenario + 1} of {scenarios.length}</h3>
                <span className="text-sm text-gray-500">
                  Score: {score}/{currentScenario}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">{currentScenarioData.title}</h3>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{currentScenarioData.description}</p>
              </div>
              
              <h4 className="font-medium mb-3">{currentScenarioData.question}</h4>
              
              <div className="space-y-3">
                {currentScenarioData.options.map((option) => (
                  <button
                    key={option.id}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${
                      selectedAnswerId === option.id
                        ? option.correct
                          ? 'bg-green-100 border-green-300'
                          : 'bg-red-100 border-red-300'
                        : showFeedback && option.correct
                        ? 'bg-green-50 border-green-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => !showFeedback && handleAnswerSelect(currentScenarioData.id, option.id)}
                    disabled={showFeedback}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                        selectedAnswerId === option.id
                          ? option.correct
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-red-500 border-red-500 text-white'
                          : showFeedback && option.correct
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswerId === option.id ? (
                          option.correct ? '✓' : '✗'
                        ) : (
                          showFeedback && option.correct ? '✓' : option.id.toUpperCase()
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {showFeedback && selectedAnswer && (
              <div className={`p-4 rounded-lg mb-6 ${
                selectedAnswer.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${selectedAnswer.correct ? 'text-green-800' : 'text-red-800'}`}>
                  {selectedAnswer.correct ? '🎉 Correct Analysis!' : '❌ Incorrect Analysis'}
                </h4>
                <p className="text-gray-700">
                  {selectedAnswer.explanation}
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              <div>
                {/* Placeholder for additional controls */}
              </div>
              
              {showFeedback ? (
                <button
                  onClick={handleNextScenario}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'See Results'}
                </button>
              ) : (
                <button
                  className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Select an Answer
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScenarioQuestion;
