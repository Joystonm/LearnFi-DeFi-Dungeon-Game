import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useCompound } from '../context/CompoundContext';

const TimedChallenge = ({ difficulty = 'medium', onComplete }) => {
  const { user, addBadge } = useUser();
  const { marketData } = useCompound();
  
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const timerRef = useRef(null);
  
  // Challenge configuration based on difficulty
  const challengeConfig = {
    easy: {
      timeLimit: 180, // 3 minutes
      tasks: 5
    },
    medium: {
      timeLimit: 120, // 2 minutes
      tasks: 5
    },
    hard: {
      timeLimit: 90, // 1.5 minutes
      tasks: 5
    }
  };
  
  // Get config based on difficulty
  const config = challengeConfig[difficulty] || challengeConfig.medium;
  
  // Generate tasks
  const generateTasks = () => {
    const tasks = [];
    
    // APY calculation tasks
    tasks.push({
      type: 'calculation',
      question: 'If you supply 1,000 DAI at 5% APY, how much interest will you earn in one year?',
      options: ['$50', '$25', '$100', '$500'],
      correctIndex: 0,
      explanation: 'The calculation is: 1,000 × 0.05 = $50'
    });
    
    tasks.push({
      type: 'calculation',
      question: 'If the collateral factor for ETH is 75% and you supply 10 ETH worth $3,000 each, what is your maximum borrowing capacity?',
      options: ['$22,500', '$30,000', '$7,500', '$15,000'],
      correctIndex: 0,
      explanation: 'The calculation is: 10 × $3,000 × 0.75 = $22,500'
    });
    
    // Market analysis tasks
    const randomMarket = marketData[Math.floor(Math.random() * marketData.length)];
    if (randomMarket) {
      tasks.push({
        type: 'market_analysis',
        question: `Which of these statements is true about ${randomMarket.symbol} in the current market?`,
        options: [
          `The supply APY is ${randomMarket.supplyApy.toFixed(2)}%`,
          `The collateral factor is ${(randomMarket.collateralFactor * 100).toFixed(0)}%`,
          `The current price is $${randomMarket.price.toFixed(2)}`,
          'All of the above'
        ],
        correctIndex: 3,
        explanation: 'All of the statements are true based on the current market data.'
      });
    }
    
    // Risk assessment tasks
    tasks.push({
      type: 'risk_assessment',
      question: 'Which of these positions has the highest liquidation risk?',
      options: [
        'Supplied: 10 ETH, Borrowed: 5,000 DAI',
        'Supplied: 5 ETH, Borrowed: 10,000 DAI',
        'Supplied: 20,000 USDC, Borrowed: 10,000 DAI',
        'Supplied: 1 BTC, Borrowed: 15,000 DAI'
      ],
      correctIndex: 1,
      explanation: 'The second position has the highest ratio of borrowed value to supplied value, making it the riskiest.'
    });
    
    // Strategy tasks
    tasks.push({
      type: 'strategy',
      question: 'Which strategy would likely yield the highest returns in a bull market?',
      options: [
        'Supply stablecoins only',
        'Supply volatile assets and borrow stablecoins',
        'Supply stablecoins and borrow volatile assets',
        'Equal supply of stablecoins and volatile assets'
      ],
      correctIndex: 1,
      explanation: 'In a bull market, supplying volatile assets that appreciate in value while borrowing stablecoins typically yields the highest returns.'
    });
    
    // Protocol knowledge tasks
    tasks.push({
      type: 'protocol_knowledge',
      question: 'What happens to your cTokens when you withdraw your supplied assets?',
      options: [
        'They are transferred to the Compound treasury',
        'They are burned in exchange for the underlying asset',
        'They remain in your wallet but become inactive',
        'They are converted to COMP tokens'
      ],
      correctIndex: 1,
      explanation: 'When you withdraw your supplied assets, your cTokens are burned (redeemed) in exchange for the underlying asset plus any accrued interest.'
    });
    
    // Shuffle and limit tasks based on config
    return tasks.sort(() => 0.5 - Math.random()).slice(0, config.tasks);
  };
  
  // Generate tasks on component mount
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    setTasks(generateTasks());
  }, []);
  
  // Start challenge
  const startChallenge = () => {
    setIsStarted(true);
    setTimeLeft(config.timeLimit);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Time's up
          clearInterval(timerRef.current);
          endChallenge();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // End challenge
  const endChallenge = () => {
    setIsCompleted(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Calculate score
    let finalScore = 0;
    tasks.forEach((task, index) => {
      if (answers[index] === task.correctIndex) {
        finalScore++;
      }
    });
    
    setScore(finalScore);
    setShowResults(true);
    
    // Award badge if score is good enough
    const passThreshold = Math.ceil(tasks.length * 0.7); // 70% to pass
    
    if (finalScore >= passThreshold) {
      const badge = {
        id: `timed_challenge_${difficulty}`,
        name: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Challenge`,
        type: 'achievement',
        description: `Completed the ${difficulty} timed challenge with a high score`
      };
      
      addBadge(badge);
    }
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete({
        difficulty,
        score: finalScore,
        totalTasks: tasks.length,
        timeUsed: config.timeLimit - timeLeft,
        passed: finalScore >= passThreshold
      });
    }
  };
  
  // Handle answer selection
  const handleAnswerSelect = (taskIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [taskIndex]: answerIndex
    });
    
    // Move to next task or end challenge if last task
    if (taskIndex < tasks.length - 1) {
      setCurrentTask(taskIndex + 1);
    } else {
      endChallenge();
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
    const percentage = (timeLeft / config.timeLimit) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Restart challenge
  const restartChallenge = () => {
    setIsStarted(false);
    setIsCompleted(false);
    setTimeLeft(0);
    setCurrentTask(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
    setTasks(generateTasks());
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`p-4 text-white ${
        difficulty === 'easy' ? 'bg-green-600' :
        difficulty === 'medium' ? 'bg-yellow-600' :
        'bg-red-600'
      }`}>
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">⏱️</span> 
          Timed DeFi Challenge - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
        </h2>
        <p className="text-sm opacity-80">
          Complete {config.tasks} tasks in {Math.floor(config.timeLimit / 60)} minutes
        </p>
      </div>
      
      <div className="p-6">
        {!isStarted ? (
          <div className="text-center py-8">
            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Ready for the Challenge?</h3>
            <p className="text-gray-600 mb-6">
              You'll have {Math.floor(config.timeLimit / 60)} minutes to complete {config.tasks} DeFi tasks.
              Test your knowledge and quick thinking!
            </p>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2 flex items-center">
                <span className="mr-2">💡</span> Challenge Rules
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Answer each question as quickly as possible</li>
                <li>You can't go back to previous questions</li>
                <li>The timer will continue until all questions are answered or time runs out</li>
                <li>You need to score at least 70% to earn the badge</li>
              </ul>
            </div>
            
            <button
              onClick={startChallenge}
              className={`px-6 py-3 rounded-lg text-white ${
                difficulty === 'easy' ? 'bg-green-600 hover:bg-green-700' :
                difficulty === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' :
                'bg-red-600 hover:bg-red-700'
              }`}
            >
              Start Challenge
            </button>
          </div>
        ) : showResults ? (
          <div className="text-center">
            <div className={`inline-block p-4 rounded-full mb-4 ${
              score >= Math.ceil(tasks.length * 0.7)
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${
                score >= Math.ceil(tasks.length * 0.7)
                  ? 'text-green-600'
                  : 'text-red-600'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {score >= Math.ceil(tasks.length * 0.7) ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">
              {score >= Math.ceil(tasks.length * 0.7)
                ? 'Challenge Completed!'
                : 'Challenge Finished'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              You scored {score} out of {tasks.length} tasks correctly.
            </p>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    score >= Math.ceil(tasks.length * 0.7)
                      ? 'bg-green-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${(score / tasks.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{tasks.length}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Time Used</h4>
                <p className="font-medium">{formatTime(config.timeLimit - timeLeft)} / {formatTime(config.timeLimit)}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Accuracy</h4>
                <p className="font-medium">{Math.round((score / tasks.length) * 100)}%</p>
              </div>
            </div>
            
            {score >= Math.ceil(tasks.length * 0.7) ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  You've earned the "{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Challenge" badge!
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                <p className="text-red-800">
                  You need to score at least {Math.ceil(tasks.length * 0.7)} out of {tasks.length} to earn the badge. Try again!
                </p>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={restartChallenge}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
              
              <button
                onClick={() => {
                  // Logic to continue to next activity
                }}
                className={`px-4 py-2 rounded-lg text-white ${
                  difficulty === 'easy' ? 'bg-green-600 hover:bg-green-700' :
                  difficulty === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-red-600 hover:bg-red-700'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Task {currentTask + 1} of {tasks.length}</h3>
                <div className={`font-mono font-medium ${getTimerColor()}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((currentTask + 1) / tasks.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-4">{tasks[currentTask]?.question}</h3>
              
              <div className="space-y-3">
                {tasks[currentTask]?.options.map((option, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => handleAnswerSelect(currentTask, index)}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-3">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimedChallenge;
