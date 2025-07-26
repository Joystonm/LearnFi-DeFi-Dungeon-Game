import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const LearningPath = ({ pathId }) => {
  const { user } = useUser();
  const [selectedPath, setSelectedPath] = useState(null);
  const [progress, setProgress] = useState(0);
  
  // Available learning paths
  const learningPaths = {
    'defi-basics': {
      id: 'defi-basics',
      name: 'DeFi Fundamentals',
      description: 'Learn the core concepts of DeFi and the Compound Protocol',
      level: 'beginner',
      estimatedTime: '2-3 hours',
      modules: [
        { id: 'ctoken', title: 'What is a cToken?', description: 'Understand the tokenization of deposits in Compound' },
        { id: 'apy', title: 'Understanding APY', description: 'Learn how interest accrues in DeFi lending protocols' },
        { id: 'collateral', title: 'Collateral Factor', description: 'Discover how borrowing capacity is determined' },
        { id: 'liquidation', title: 'Liquidation Risk', description: 'Understand the risks of borrowing in DeFi' }
      ]
    },
    'lending-strategies': {
      id: 'lending-strategies',
      name: 'Lending Strategies',
      description: 'Master different approaches to lending on Compound',
      level: 'intermediate',
      estimatedTime: '3-4 hours',
      modules: [
        { id: 'apy', title: 'Understanding APY', description: 'Learn how interest accrues in DeFi lending protocols' },
        { id: 'interest', title: 'Interest Rate Models', description: 'Explore how interest rates are determined' },
        { id: 'collateral', title: 'Collateral Factor', description: 'Discover how borrowing capacity is determined' },
        { id: 'governance', title: 'Compound Governance', description: 'Learn how protocol parameters are adjusted' }
      ]
    },
    'borrowing-strategies': {
      id: 'borrowing-strategies',
      name: 'Borrowing Strategies',
      description: 'Learn effective techniques for borrowing on Compound',
      level: 'intermediate',
      estimatedTime: '3-4 hours',
      modules: [
        { id: 'collateral', title: 'Collateral Factor', description: 'Discover how borrowing capacity is determined' },
        { id: 'liquidation', title: 'Liquidation Risk', description: 'Understand the risks of borrowing in DeFi' },
        { id: 'interest', title: 'Interest Rate Models', description: 'Explore how interest rates are determined' },
        { id: 'governance', title: 'Compound Governance', description: 'Learn how protocol parameters are adjusted' }
      ]
    },
    'yield-farming': {
      id: 'yield-farming',
      name: 'Yield Farming Techniques',
      description: 'Advanced strategies for maximizing returns',
      level: 'advanced',
      estimatedTime: '4-5 hours',
      modules: [
        { id: 'interest', title: 'Interest Rate Models', description: 'Explore how interest rates are determined' },
        { id: 'governance', title: 'Compound Governance', description: 'Learn how protocol parameters are adjusted' },
        { id: 'liquidation', title: 'Liquidation Risk', description: 'Understand the risks of borrowing in DeFi' },
        { id: 'collateral', title: 'Collateral Factor', description: 'Discover how borrowing capacity is determined' }
      ]
    }
  };
  
  // Set default path or use provided pathId
  useEffect(() => {
    const path = pathId ? learningPaths[pathId] : learningPaths['defi-basics'];
    setSelectedPath(path);
    
    // Calculate progress
    if (path) {
      const completedModules = path.modules.filter(module => 
        user.completedTopics.includes(module.id)
      ).length;
      
      setProgress(Math.round((completedModules / path.modules.length) * 100));
    }
  }, [pathId, user.completedTopics]);
  
  // Handle path selection
  const handlePathSelect = (pathId) => {
    setSelectedPath(learningPaths[pathId]);
    
    // Calculate progress
    const completedModules = learningPaths[pathId].modules.filter(module => 
      user.completedTopics.includes(module.id)
    ).length;
    
    setProgress(Math.round((completedModules / learningPaths[pathId].modules.length) * 100));
  };
  
  // Get level badge color
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!selectedPath) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🗺️</span> Learning Paths
        </h2>
        <p className="text-sm text-blue-100">
          Structured learning journeys tailored to your interests
        </p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Learning Path
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(learningPaths).map((path) => (
              <button
                key={path.id}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  selectedPath.id === path.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handlePathSelect(path.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{path.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(path.level)}`}>
                    {path.level}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{path.description}</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">{selectedPath.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(selectedPath.level)}`}>
              {selectedPath.level}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{selectedPath.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-gray-500">Estimated time:</span> {selectedPath.estimatedTime}
            </div>
            <div>
              <span className="text-gray-500">Modules:</span> {selectedPath.modules.length}
            </div>
            <div>
              <span className="text-gray-500">Progress:</span> {progress}%
            </div>
          </div>
          
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Path Modules</h3>
          
          <div className="space-y-4">
            {selectedPath.modules.map((module, index) => {
              const isCompleted = user.completedTopics.includes(module.id);
              const isAvailable = index === 0 || user.completedTopics.includes(selectedPath.modules[index - 1].id);
              
              return (
                <div 
                  key={module.id}
                  className={`border rounded-lg overflow-hidden ${
                    isCompleted ? 'border-green-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center p-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isAvailable
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    
                    <div className="flex-grow">
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                    
                    <Link
                      to={`/learn/${module.id}`}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        isAvailable
                          ? isCompleted
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => !isAvailable && e.preventDefault()}
                    >
                      {isCompleted ? 'Review' : isAvailable ? 'Start' : 'Locked'}
                    </Link>
                  </div>
                  
                  {isCompleted && (
                    <div className="bg-green-50 px-4 py-2 border-t border-green-100">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-green-700">Completed</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {progress === 100 && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Path Completed!</h4>
                <p className="text-sm text-green-600">
                  Congratulations! You've completed all modules in this learning path.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={() => handlePathSelect('defi-basics')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Reset Selection
          </button>
          
          {progress < 100 && selectedPath.modules.length > 0 && (
            <Link
              to={`/learn/${selectedPath.modules[0].id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Learning
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
