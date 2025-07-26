import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const SkillAssessment = () => {
  const navigate = useNavigate();
  const { user, addBadge } = useUser();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [skillLevel, setSkillLevel] = useState(null);
  const [recommendedPath, setRecommendedPath] = useState(null);
  
  // Assessment questions
  const questions = [
    {
      id: 'q1',
      text: 'How familiar are you with DeFi concepts?',
      options: [
        { id: 'a', text: 'Not familiar at all', level: 'beginner' },
        { id: 'b', text: 'I understand the basics', level: 'beginner' },
        { id: 'c', text: 'I have some experience using DeFi protocols', level: 'intermediate' },
        { id: 'd', text: 'I am very experienced with DeFi', level: 'advanced' }
      ]
    },
    {
      id: 'q2',
      text: 'Have you used lending protocols like Compound before?',
      options: [
        { id: 'a', text: 'Never', level: 'beginner' },
        { id: 'b', text: 'I\'ve read about them but never used them', level: 'beginner' },
        { id: 'c', text: 'I\'ve supplied assets but never borrowed', level: 'intermediate' },
        { id: 'd', text: 'I\'ve both supplied and borrowed assets', level: 'advanced' }
      ]
    },
    {
      id: 'q3',
      text: 'Do you understand what collateralization means in DeFi?',
      options: [
        { id: 'a', text: 'No, I don\'t know what that is', level: 'beginner' },
        { id: 'b', text: 'I have a basic understanding', level: 'beginner' },
        { id: 'c', text: 'Yes, I understand how it works', level: 'intermediate' },
        { id: 'd', text: 'Yes, and I understand different collateralization strategies', level: 'advanced' }
      ]
    },
    {
      id: 'q4',
      text: 'What interests you most about DeFi?',
      options: [
        { id: 'a', text: 'Learning the basics and terminology', interest: 'basics' },
        { id: 'b', text: 'Earning yield on my assets', interest: 'lending' },
        { id: 'c', text: 'Borrowing against my assets', interest: 'borrowing' },
        { id: 'd', text: 'Advanced strategies like yield farming', interest: 'yield-farming' }
      ]
    },
    {
      id: 'q5',
      text: 'How comfortable are you with financial risk?',
      options: [
        { id: 'a', text: 'Very conservative, I prefer safety', risk: 'low' },
        { id: 'b', text: 'Somewhat conservative', risk: 'low-medium' },
        { id: 'c', text: 'Willing to take calculated risks', risk: 'medium-high' },
        { id: 'd', text: 'Comfortable with high risk for high reward', risk: 'high' }
      ]
    }
  ];
  
  // Learning paths
  const learningPaths = {
    beginner: {
      name: 'DeFi Fundamentals',
      description: 'Master the basics of DeFi and the Compound Protocol',
      modules: [
        { id: 'ctoken', title: 'What is a cToken?', priority: 'high' },
        { id: 'apy', title: 'Understanding APY', priority: 'high' },
        { id: 'collateral', title: 'Collateral Factor', priority: 'medium' },
        { id: 'liquidation', title: 'Liquidation Risk', priority: 'medium' }
      ]
    },
    intermediate: {
      name: 'DeFi Strategies',
      description: 'Learn effective strategies for lending and borrowing',
      modules: [
        { id: 'collateral', title: 'Collateral Factor', priority: 'high' },
        { id: 'liquidation', title: 'Liquidation Risk', priority: 'high' },
        { id: 'interest', title: 'Interest Rate Models', priority: 'medium' },
        { id: 'governance', title: 'Compound Governance', priority: 'low' }
      ]
    },
    advanced: {
      name: 'Advanced DeFi Techniques',
      description: 'Master complex DeFi strategies and optimizations',
      modules: [
        { id: 'interest', title: 'Interest Rate Models', priority: 'high' },
        { id: 'governance', title: 'Compound Governance', priority: 'medium' },
        { id: 'liquidation', title: 'Liquidation Risk', priority: 'high' },
        { id: 'collateral', title: 'Collateral Factor', priority: 'medium' }
      ]
    }
  };
  
  // Handle answer selection
  const selectAnswer = (questionId, optionId, optionData) => {
    setAnswers({
      ...answers,
      [questionId]: { optionId, ...optionData }
    });
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };
  
  // Calculate assessment results
  const calculateResults = () => {
    // Count levels to determine skill level
    const levelCounts = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };
    
    // Count interests
    const interests = {
      basics: 0,
      lending: 0,
      borrowing: 0,
      'yield-farming': 0
    };
    
    // Count risk tolerance
    const riskLevels = {
      low: 0,
      'low-medium': 0,
      'medium-high': 0,
      high: 0
    };
    
    // Process answers
    Object.values(answers).forEach(answer => {
      if (answer.level) {
        levelCounts[answer.level]++;
      }
      
      if (answer.interest) {
        interests[answer.interest]++;
      }
      
      if (answer.risk) {
        riskLevels[answer.risk]++;
      }
    });
    
    // Determine skill level
    let level;
    if (levelCounts.advanced >= 2) {
      level = 'advanced';
    } else if (levelCounts.intermediate >= 2 || (levelCounts.intermediate >= 1 && levelCounts.advanced >= 1)) {
      level = 'intermediate';
    } else {
      level = 'beginner';
    }
    
    // Determine primary interest
    const primaryInterest = Object.entries(interests)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Determine risk tolerance
    const riskTolerance = Object.entries(riskLevels)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Set skill level
    setSkillLevel(level);
    
    // Get base learning path
    const basePath = learningPaths[level];
    
    // Customize path based on interests and risk tolerance
    let customizedPath = { ...basePath };
    
    // Adjust modules based on interest
    if (primaryInterest === 'lending') {
      customizedPath.modules = customizedPath.modules.map(module => {
        if (['apy', 'ctoken'].includes(module.id)) {
          return { ...module, priority: 'high' };
        }
        return module;
      });
    } else if (primaryInterest === 'borrowing') {
      customizedPath.modules = customizedPath.modules.map(module => {
        if (['collateral', 'liquidation'].includes(module.id)) {
          return { ...module, priority: 'high' };
        }
        return module;
      });
    } else if (primaryInterest === 'yield-farming') {
      customizedPath.modules = customizedPath.modules.map(module => {
        if (['interest', 'governance'].includes(module.id)) {
          return { ...module, priority: 'high' };
        }
        return module;
      });
    }
    
    // Adjust modules based on risk tolerance
    if (riskTolerance === 'low' || riskTolerance === 'low-medium') {
      customizedPath.modules = customizedPath.modules.map(module => {
        if (['liquidation'].includes(module.id)) {
          return { ...module, priority: 'high' };
        }
        return module;
      });
    }
    
    // Sort modules by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    customizedPath.modules.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Set recommended path
    setRecommendedPath(customizedPath);
    
    // Show results
    setShowResults(true);
    
    // Save assessment results to user profile
    localStorage.setItem('skillAssessment', JSON.stringify({
      level,
      primaryInterest,
      riskTolerance,
      completedAt: new Date().toISOString()
    }));
    
    // Award badge for completing assessment
    const badge = {
      id: 'skill_assessment',
      name: 'Self-Aware Learner',
      type: 'achievement',
      description: 'Completed the DeFi skill assessment'
    };
    addBadge(badge);
  };
  
  // Start a learning module
  const startModule = (moduleId) => {
    navigate(`/learn/${moduleId}`);
  };
  
  // Restart assessment
  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSkillLevel(null);
    setRecommendedPath(null);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">📝</span> DeFi Skill Assessment
        </h2>
        <p className="text-sm text-blue-100">
          Discover your knowledge level and get a personalized learning path
        </p>
      </div>
      
      <div className="p-6">
        {showResults ? (
          <div>
            <div className="mb-6 text-center">
              <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Assessment Complete!</h3>
              <p className="text-gray-600">
                Based on your answers, we've created a personalized learning path for you.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Your DeFi Knowledge Level</h4>
              <div className="flex items-center">
                <div className={`h-2 flex-grow rounded-full overflow-hidden bg-gray-200`}>
                  <div 
                    className={`h-full ${
                      skillLevel === 'beginner' ? 'w-1/3 bg-blue-500' : 
                      skillLevel === 'intermediate' ? 'w-2/3 bg-blue-500' : 
                      'w-full bg-blue-500'
                    }`}
                  ></div>
                </div>
                <span className="ml-3 font-medium capitalize">{skillLevel}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Your Personalized Learning Path</h4>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-blue-800">{recommendedPath.name}</h5>
                <p className="text-sm text-gray-600 mb-2">{recommendedPath.description}</p>
              </div>
              
              <div className="space-y-3">
                {recommendedPath.modules.map((module, index) => (
                  <div 
                    key={module.id}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="mr-3 text-xl">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-medium">{module.title}</h5>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          module.priority === 'high' ? 'bg-red-100 text-red-800' :
                          module.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {module.priority === 'high' ? 'High Priority' :
                           module.priority === 'medium' ? 'Medium Priority' :
                           'Optional'}
                        </span>
                        {user.completedTopics.includes(module.id) && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => startModule(module.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      {user.completedTopics.includes(module.id) ? 'Review' : 'Start'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={restartAssessment}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Retake Assessment
              </button>
              
              <button
                onClick={() => startModule(recommendedPath.modules[0].id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Learning Path
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Question {currentQuestion + 1} of {questions.length}</h3>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">{questions[currentQuestion].text}</h3>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    className="w-full text-left p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => selectAnswer(
                      questions[currentQuestion].id, 
                      option.id, 
                      {
                        level: option.level,
                        interest: option.interest,
                        risk: option.risk
                      }
                    )}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${
                        answers[questions[currentQuestion].id]?.optionId === option.id
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      } flex items-center justify-center mr-3`}>
                        {answers[questions[currentQuestion].id]?.optionId === option.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-lg ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                  } else if (Object.keys(answers).length === questions.length) {
                    calculateResults();
                  }
                }}
                disabled={!answers[questions[currentQuestion].id] && currentQuestion === questions.length - 1}
                className={`px-4 py-2 rounded-lg ${
                  !answers[questions[currentQuestion].id] && currentQuestion === questions.length - 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentQuestion < questions.length - 1 ? 'Next' : 'See Results'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillAssessment;
