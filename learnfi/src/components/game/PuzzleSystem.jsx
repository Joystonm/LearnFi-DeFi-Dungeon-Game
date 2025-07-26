import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import RoomExitModal from './RoomExitModal';
import { TOKENS } from '../../data/gameData';

const PuzzleSystem = ({ room, playerStats, onComplete, onRoomExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [showRoomExit, setShowRoomExit] = useState(false);

  const puzzleRef = useRef(null);

  useEffect(() => {
    // Puzzle entrance animation
    gsap.fromTo(puzzleRef.current, 
      { scale: 0.9, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }
    );
    
    console.log('PuzzleSystem mounted with room:', room);
  }, [room]);

  const handleSubmitAnswer = () => {
    const challenge = room.challenge;
    let correct = false;
    let result = null;

    switch (challenge.type) {
      case 'introduction':
        correct = parseInt(userAnswer) === challenge.correct;
        break;

      case 'supply_tokens':
        correct = selectedToken === challenge.requiredAction.token && 
                 selectedAmount >= challenge.requiredAction.amount;
        if (correct) {
          const token = TOKENS[selectedToken];
          result = {
            expectedReturn: (selectedAmount * token.baseAPY / 100).toFixed(2),
            cTokensReceived: (selectedAmount * 50).toFixed(0) // Simplified cToken calculation
          };
        }
        break;

      case 'collateral_management':
        correct = selectedToken === challenge.requiredAction.token && 
                 selectedAmount >= challenge.requiredAction.amount;
        if (correct) {
          const token = TOKENS[selectedToken];
          result = {
            collateralValue: selectedAmount,
            borrowingPower: (selectedAmount * token.collateralFactor).toFixed(2),
            collateralFactor: (token.collateralFactor * 100).toFixed(0) + '%'
          };
        }
        break;

      case 'apy_calculation':
        const expectedDifference = challenge.scenario.borrowAPY - challenge.scenario.supplyAPY;
        const userDifference = parseFloat(userAnswer);
        correct = Math.abs(userDifference - expectedDifference) < 0.1;
        if (correct) {
          result = {
            spread: expectedDifference.toFixed(2) + '%',
            netCost: (challenge.scenario.amount * expectedDifference / 100).toFixed(2)
          };
        }
        break;

      case 'governance_quiz':
        const currentQuestion = challenge.questions[currentStep];
        correct = parseInt(userAnswer) === currentQuestion.correct;
        break;

      default:
        correct = userAnswer.toLowerCase() === challenge.correctAnswer?.toLowerCase();
    }

    setIsCorrect(correct);
    setCalculationResult(result);
    setShowExplanation(true);

    // Animation for correct/incorrect
    if (correct) {
      gsap.to('.puzzle-content', {
        backgroundColor: '#065f46', // green-800
        duration: 0.5,
        yoyo: true,
        repeat: 1
      });
    } else {
      gsap.to('.puzzle-content', {
        x: -10,
        duration: 0.1,
        yoyo: true,
        repeat: 5
      });
    }
  };

  const handleComplete = () => {
    if (isCorrect) {
      // Success animation
      gsap.to(puzzleRef.current, {
        scale: 1.1,
        rotation: 5,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        onComplete: () => onComplete(room.rewards)
      });
    } else {
      // Reset for another attempt
      setShowExplanation(false);
      setIsCorrect(null);
      setUserAnswer('');
      setSelectedAmount(0);
      setCalculationResult(null);
    }
  };

  const renderPuzzleContent = () => {
    const challenge = room.challenge;

    switch (challenge.type) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Welcome to DeFi Dungeon!</h3>
              <p className="text-lg text-gray-300">{challenge.question}</p>
            </div>

            <div className="bg-indigo-900 bg-opacity-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-xl">Choose the correct answer:</h4>
              <div className="space-y-3">
                {challenge.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setUserAnswer(index.toString())}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      userAnswer === index.toString()
                        ? 'border-indigo-400 bg-indigo-700'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'supply_tokens':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Supply Tokens Challenge</h3>
              <p className="text-lg text-gray-300">{challenge.instruction}</p>
            </div>

            <div className="bg-blue-900 bg-opacity-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Select Token to Supply:</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(TOKENS).map(([symbol, token]) => (
                  <button
                    key={symbol}
                    onClick={() => setSelectedToken(symbol)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedToken === symbol 
                        ? 'border-blue-400 bg-blue-700' 
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{token.icon}</div>
                    <div className="font-semibold">{token.name}</div>
                    <div className="text-sm text-gray-300">APY: {token.baseAPY}%</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-900 bg-opacity-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Amount to Supply:</h4>
              <input
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                placeholder="Enter amount..."
                min="0"
                max={playerStats.tokens}
              />
              <div className="text-sm text-gray-400 mt-2">
                Available: {playerStats.tokens} tokens
              </div>
            </div>
          </div>
        );

      case 'collateral_management':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Collateral Management</h3>
              <p className="text-lg text-gray-300">{challenge.instruction}</p>
            </div>

            <div className="bg-purple-900 bg-opacity-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Choose Collateral Token:</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(TOKENS).map(([symbol, token]) => (
                  <button
                    key={symbol}
                    onClick={() => setSelectedToken(symbol)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedToken === symbol 
                        ? 'border-purple-400 bg-purple-700' 
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{token.icon}</div>
                    <div className="font-semibold">{token.name}</div>
                    <div className="text-sm text-gray-300">
                      Collateral Factor: {(token.collateralFactor * 100).toFixed(0)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-900 bg-opacity-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Amount to Supply as Collateral:</h4>
              <input
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                placeholder="Enter amount..."
                min="0"
                step="0.1"
              />
            </div>
          </div>
        );

      case 'apy_calculation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">APY Calculation Challenge</h3>
              <p className="text-lg text-gray-300">{challenge.instruction}</p>
            </div>

            <div className="bg-yellow-900 bg-opacity-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Market Scenario:</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-300">Supply APY</div>
                  <div className="text-2xl font-bold text-green-400">
                    {challenge.scenario.supplyAPY}%
                  </div>
                </div>
                <div className="bg-red-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-300">Borrow APY</div>
                  <div className="text-2xl font-bold text-red-400">
                    {challenge.scenario.borrowAPY}%
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-sm text-gray-300">Amount</div>
                <div className="text-xl font-bold">${challenge.scenario.amount}</div>
              </div>
            </div>

            <div className="bg-blue-900 bg-opacity-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Calculate the APY Spread (Borrow - Supply):</h4>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                placeholder="Enter percentage difference..."
                step="0.1"
              />
              <div className="text-sm text-gray-400 mt-2">
                Enter the difference between borrow and supply APY
              </div>
            </div>
          </div>
        );

      case 'governance_quiz':
        const currentQuestion = challenge.questions[currentStep];
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Governance Quiz</h3>
              <p className="text-lg text-gray-300">{challenge.instruction}</p>
            </div>

            <div className="bg-indigo-900 bg-opacity-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-xl">{currentQuestion.question}</h4>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setUserAnswer(index.toString())}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      userAnswer === index.toString()
                        ? 'border-indigo-400 bg-indigo-700'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Unknown Puzzle Type</h3>
            <p>This puzzle type is not yet implemented.</p>
          </div>
        );
    }
  };

  return (
    <div ref={puzzleRef} className="puzzle-system w-full min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white p-8 overflow-y-auto"
         style={{ height: '100vh', WebkitOverflowScrolling: 'touch' }}>
      
      {/* Room Exit Button */}
      <button
        onClick={() => setShowRoomExit(true)}
        className="sticky top-4 left-4 z-40 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
      >
        <span>←</span>
        <span>Exit Room</span>
      </button>

      {/* Room header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{room.name}</h1>
        <p className="text-lg text-gray-300 mb-4">{room.description}</p>
        <div className="inline-block bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
          Learning: {room.concept}
        </div>
      </div>

      {/* Puzzle content */}
      <div className="puzzle-content max-w-4xl mx-auto">
        {!showExplanation ? (
          <>
            {renderPuzzleContent()}
            
            {/* Submit button */}
            <div className="text-center mt-8">
              <button
                onClick={handleSubmitAnswer}
                disabled={
                  (room.challenge.type.includes('supply') || room.challenge.type.includes('collateral')) 
                    ? !selectedToken || selectedAmount <= 0
                    : !userAnswer
                }
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300"
              >
                Submit Answer
              </button>
            </div>
          </>
        ) : (
          /* Explanation and results */
          <div className="space-y-6">
            <div className={`text-center p-6 rounded-lg ${isCorrect ? 'bg-green-900 bg-opacity-50' : 'bg-red-900 bg-opacity-50'}`}>
              <div className="text-4xl mb-4">
                {isCorrect ? '🎉' : '❌'}
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {isCorrect ? 'Correct!' : 'Not Quite Right'}
              </h3>
              
              {calculationResult && (
                <div className="bg-black bg-opacity-30 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Calculation Results:</h4>
                  {Object.entries(calculationResult).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-gray-300">{room.challenge.explanation}</p>
            </div>

            <div className="text-center">
              <button
                onClick={handleComplete}
                className={`font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 ${
                  isCorrect 
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500'
                }`}
              >
                {isCorrect ? 'Continue Adventure' : 'Try Again'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg">
        <div className="text-sm text-gray-400">Room Progress</div>
        <div className="text-lg font-bold">
          {showExplanation && isCorrect ? '✓ Complete' : 'In Progress...'}
        </div>
      </div>

      {/* Room Exit Modal */}
      <RoomExitModal
        isOpen={showRoomExit}
        onClose={() => setShowRoomExit(false)}
        onConfirmExit={onRoomExit}
        playerStats={playerStats}
        currentRoom={room.id}
      />
    </div>
  );
};

export default PuzzleSystem;
