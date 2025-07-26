import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';

const AdvancedQuiz = ({ topic, difficulty = 'medium', onComplete }) => {
  const { addBadge } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef(null);
  
  // Quiz questions based on topic and difficulty
  const quizQuestions = {
    ctoken: {
      beginner: [
        {
          question: "What is a cToken in the Compound Protocol?",
          options: [
            "A type of cryptocurrency that can only be used within Compound",
            "A token that represents your deposited assets in Compound",
            "A token used for governance voting in Compound",
            "A token that represents your borrowed assets in Compound"
          ],
          correctIndex: 1,
          explanation: "cTokens are tokens that represent your deposited assets in Compound. When you supply an asset, you receive cTokens in return which automatically earn interest."
        },
        {
          question: "How do cTokens generate interest for users?",
          options: [
            "Through manual dividend payments",
            "Through their exchange rate, which increases over time",
            "Through staking rewards",
            "Through transaction fees"
          ],
          correctIndex: 1,
          explanation: "cTokens generate interest through their exchange rate, which increases over time relative to the underlying asset. This means each cToken becomes worth more of the underlying asset as time passes."
        }
      ],
      medium: [
        {
          question: "If you supply 100 DAI to Compound, what happens?",
          options: [
            "You receive 100 cDAI tokens in return",
            "You receive cDAI tokens worth 100 DAI based on the current exchange rate",
            "Your DAI is locked for a fixed period",
            "You immediately start earning COMP tokens"
          ],
          correctIndex: 1,
          explanation: "When you supply DAI to Compound, you receive cDAI tokens based on the current exchange rate. The amount of cDAI you receive is calculated as: amount of DAI / exchange rate."
        },
        {
          question: "What happens to your cTokens when you withdraw your supplied assets?",
          options: [
            "They are burned in exchange for the underlying asset plus interest",
            "They are transferred to the Compound treasury",
            "They remain in your wallet but become inactive",
            "They are converted to COMP tokens"
          ],
          correctIndex: 0,
          explanation: "When you withdraw your supplied assets, your cTokens are burned (redeemed) in exchange for the underlying asset plus any accrued interest."
        }
      ],
      advanced: [
        {
          question: "In a scenario where the cDAI exchange rate is 0.02 DAI per cDAI, how many cDAI would you receive for supplying 100 DAI?",
          options: [
            "2 cDAI",
            "20 cDAI",
            "200 cDAI",
            "5000 cDAI"
          ],
          correctIndex: 3,
          explanation: "The calculation is: Amount of DAI / Exchange Rate = Amount of cDAI. So 100 DAI / 0.02 = 5000 cDAI."
        },
        {
          question: "If the cDAI exchange rate increases from 0.02 to 0.021 over a period, and you hold 5000 cDAI, what is your interest earned in DAI?",
          options: [
            "0.001 DAI",
            "0.5 DAI",
            "5 DAI",
            "50 DAI"
          ],
          correctIndex: 2,
          explanation: "Initial value: 5000 cDAI × 0.02 = 100 DAI. New value: 5000 cDAI × 0.021 = 105 DAI. Interest earned: 105 - 100 = 5 DAI."
        }
      ]
    },
    liquidation: {
      beginner: [
        {
          question: "What is liquidation in the context of Compound?",
          options: [
            "Converting your crypto assets to fiat currency",
            "Selling your cTokens on an exchange",
            "The process of repaying a loan when the protocol is shutting down",
            "The forced sale of a borrower's collateral when their position becomes undercollateralized"
          ],
          correctIndex: 3,
          explanation: "Liquidation is the forced sale of a borrower's collateral when their position becomes undercollateralized, meaning the value of their collateral falls below the required threshold relative to their borrowed amount."
        },
        {
          question: "What triggers a liquidation in Compound?",
          options: [
            "When a user fails to repay their loan on time",
            "When the value of collateral falls below the required threshold",
            "When the interest rates become too high",
            "When the user withdraws their supplied assets"
          ],
          correctIndex: 1,
          explanation: "A liquidation is triggered when the value of a user's collateral falls below the required threshold relative to their borrowed amount, often due to price fluctuations of the collateral asset."
        }
      ],
      medium: [
        {
          question: "What is the 'health factor' in lending protocols like Compound?",
          options: [
            "The ratio of total supplied assets to total borrowed assets",
            "The percentage of your assets that are considered healthy investments",
            "A measure of how close your position is to liquidation",
            "The overall financial health of the Compound protocol"
          ],
          correctIndex: 2,
          explanation: "The health factor is a measure of how close your position is to liquidation. A higher health factor means your position is safer, while a health factor below 1 means your position is eligible for liquidation."
        },
        {
          question: "What happens during a liquidation event?",
          options: [
            "Your entire collateral is sold to repay your debt",
            "A portion of your collateral is sold at a discount to repay part of your debt",
            "Your borrowed assets are frozen until you add more collateral",
            "The protocol automatically adds more collateral to your position"
          ],
          correctIndex: 1,
          explanation: "During a liquidation event, a portion of your collateral is sold at a discount (liquidation penalty) to repay part of your debt. Liquidators perform this function and receive the discount as an incentive."
        }
      ],
      advanced: [
        {
          question: "If a user has supplied 10 ETH (worth $3,500 each) as collateral with a collateral factor of 75%, and has borrowed 20,000 USDC, what would happen if ETH price drops to $3,000?",
          options: [
            "Nothing, the position is still safe",
            "They would receive a warning but no liquidation",
            "Their position would be partially liquidated",
            "Their entire collateral would be liquidated"
          ],
          correctIndex: 0,
          explanation: "Initial collateral value: 10 ETH × $3,500 = $35,000. Maximum borrow with 75% collateral factor: $35,000 × 0.75 = $26,250. After price drop: 10 ETH × $3,000 = $30,000. New maximum borrow: $30,000 × 0.75 = $22,500. Since the borrowed amount ($20,000) is still below the new maximum ($22,500), the position is still safe."
        },
        {
          question: "In a scenario where a liquidation occurs with a 10% liquidation penalty, how much collateral would a liquidator receive for repaying 1,000 DAI of a user's debt?",
          options: [
            "900 DAI worth of collateral",
            "1,000 DAI worth of collateral",
            "1,100 DAI worth of collateral",
            "1,000 DAI plus gas fees"
          ],
          correctIndex: 2,
          explanation: "With a 10% liquidation penalty, a liquidator would receive 1,100 DAI worth of collateral for repaying 1,000 DAI of debt. The extra 10% (100 DAI worth) is the liquidation incentive."
        }
      ]
    }
  };
  
  // Get questions based on topic and difficulty
  const getQuestions = () => {
    // Default to cToken if topic not found
    const topicQuestions = quizQuestions[topic] || quizQuestions.ctoken;
    
    // Default to medium difficulty if not found
    return topicQuestions[difficulty] || topicQuestions.medium;
  };
  
  const questions = getQuestions();
  
  // Set up timer based on difficulty
  useEffect(() => {
    const setupTimer = () => {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Set time based on difficulty
      let time;
      switch (difficulty) {
        case 'beginner':
          time = 60; // 60 seconds per question
          break;
        case 'medium':
          time = 45; // 45 seconds per question
          break;
        case 'advanced':
          time = 30; // 30 seconds per question
          break;
        default:
          time = 45;
      }
      
      setTimeLeft(time);
      setIsTimerActive(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Time's up
            clearInterval(timerRef.current);
            setIsTimerActive(false);
            
            // Auto-submit if no answer selected
            if (selectedAnswer === null) {
              handleAnswerSubmit(-1); // -1 indicates timeout
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    };
    
    // Only set up timer for timed quizzes and when not showing results
    if (difficulty !== 'untimed' && !showResults && selectedAnswer === null) {
      setupTimer();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, difficulty, selectedAnswer, showResults]);
  
  // Handle answer selection
  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null || !isTimerActive) return;
    
    setSelectedAnswer(index);
    setIsTimerActive(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Check if answer is correct
    const isAnswerCorrect = index === questions[currentQuestion].correctIndex;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
  };
  
  // Handle answer submission (including timeout)
  const handleAnswerSubmit = (index) => {
    // If index is -1, it means timeout
    if (index === -1) {
      setSelectedAnswer(null);
      setIsCorrect(false);
    } else {
      handleAnswerSelect(index);
    }
  };
  
  // Move to next question or show results
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      // Quiz completed
      setShowResults(true);
      
      // Award badge based on score
      const passThreshold = Math.ceil(questions.length * 0.7); // 70% to pass
      
      if (score >= passThreshold) {
        const badge = {
          id: `quiz_${topic}_${difficulty}`,
          name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz`,
          type: 'quiz',
          description: `Passed the ${difficulty} difficulty quiz on ${topic}`
        };
        
        addBadge(badge);
      }
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete({
          topic,
          difficulty,
          score,
          totalQuestions: questions.length,
          passed: score >= passThreshold
        });
      }
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Get timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 15) return 'text-blue-600';
    if (timeLeft > 5) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`p-4 text-white ${
        difficulty === 'beginner' ? 'bg-green-600' :
        difficulty === 'medium' ? 'bg-blue-600' :
        'bg-purple-600'
      }`}>
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🧠</span> 
          {topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
        </h2>
        <p className="text-sm opacity-80">
          Test your knowledge with this {questions.length}-question quiz
        </p>
      </div>
      
      <div className="p-6">
        {showResults ? (
          <div className="text-center">
            <div className={`inline-block p-4 rounded-full mb-4 ${
              score >= Math.ceil(questions.length * 0.7)
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${
                score >= Math.ceil(questions.length * 0.7)
                  ? 'text-green-600'
                  : 'text-red-600'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {score >= Math.ceil(questions.length * 0.7) ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">
              {score >= Math.ceil(questions.length * 0.7)
                ? 'Congratulations!'
                : 'Quiz Completed'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              You scored {score} out of {questions.length} questions correctly.
            </p>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    score >= Math.ceil(questions.length * 0.7)
                      ? 'bg-green-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${(score / questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{questions.length}</span>
              </div>
            </div>
            
            {score >= Math.ceil(questions.length * 0.7) ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  You've earned the "{topic.charAt(0).toUpperCase() + topic.slice(1)} {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz" badge!
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  You need to score at least {Math.ceil(questions.length * 0.7)} out of {questions.length} to earn the badge. Try again!
                </p>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setIsCorrect(null);
                  setScore(0);
                  setShowResults(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
              
              <button
                onClick={() => {
                  // Go to next difficulty level if passed
                  if (score >= Math.ceil(questions.length * 0.7)) {
                    // Logic to move to next difficulty
                  }
                }}
                className={`px-4 py-2 rounded-lg ${
                  score >= Math.ceil(questions.length * 0.7)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={score < Math.ceil(questions.length * 0.7)}
              >
                {score >= Math.ceil(questions.length * 0.7) ? 'Continue' : 'Continue'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Question {currentQuestion + 1} of {questions.length}</h3>
                {difficulty !== 'untimed' && (
                  <div className={`font-mono font-medium ${getTimerColor()}`}>
                    {formatTime(timeLeft)}
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-4">{questions[currentQuestion].question}</h3>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? index === questions[currentQuestion].correctIndex
                          ? 'bg-green-100 border-green-300'
                          : 'bg-red-100 border-red-300'
                        : 'hover:bg-gray-50'
                    } ${
                      selectedAnswer !== null && selectedAnswer !== index && index === questions[currentQuestion].correctIndex
                        ? 'bg-green-50 border-green-200'
                        : ''
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                        selectedAnswer === index
                          ? index === questions[currentQuestion].correctIndex
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-red-500 border-red-500 text-white'
                          : selectedAnswer !== null && index === questions[currentQuestion].correctIndex
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index ? (
                          index === questions[currentQuestion].correctIndex ? '✓' : '✗'
                        ) : (
                          selectedAnswer !== null && index === questions[currentQuestion].correctIndex ? '✓' : String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {selectedAnswer !== null && (
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                </h4>
                <p className="text-gray-700">
                  {questions[currentQuestion].explanation}
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              <div>
                {/* Placeholder for balance */}
              </div>
              
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-6 py-2 rounded-lg ${
                  selectedAnswer === null
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedQuiz;
