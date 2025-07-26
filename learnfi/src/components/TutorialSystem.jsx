import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const TutorialSystem = ({ tutorialId, steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const { user, addBadge } = useUser();

  // Check if user has already completed this tutorial
  useEffect(() => {
    const completedTutorials = localStorage.getItem('completedTutorials') 
      ? JSON.parse(localStorage.getItem('completedTutorials')) 
      : [];
    
    if (completedTutorials.includes(tutorialId)) {
      setIsVisible(false);
    }
  }, [tutorialId]);

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed
      setCompleted(true);
      
      // Save completion to localStorage
      const completedTutorials = localStorage.getItem('completedTutorials') 
        ? JSON.parse(localStorage.getItem('completedTutorials')) 
        : [];
      
      if (!completedTutorials.includes(tutorialId)) {
        completedTutorials.push(tutorialId);
        localStorage.setItem('completedTutorials', JSON.stringify(completedTutorials));
        
        // Award badge for first tutorial completion
        if (completedTutorials.length === 1) {
          const badge = {
            id: 'tutorial_master',
            name: 'Tutorial Master',
            type: 'achievement',
            description: 'Completed your first interactive tutorial'
          };
          addBadge(badge);
        }
      }
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Handle skip tutorial
  const handleSkip = () => {
    setIsVisible(false);
  };

  // Handle restart tutorial
  const handleRestart = () => {
    setCurrentStep(0);
    setCompleted(false);
  };

  // Navigate to a specific page as part of the tutorial
  const navigateTo = (path) => {
    navigate(path);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
        {completed ? (
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-4">Tutorial Completed!</h2>
            <p className="text-gray-600 mb-6">
              You've successfully completed the {steps[0].title} tutorial.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsVisible(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Restart Tutorial
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{steps[currentStep].description}</p>
              
              {steps[currentStep].image && (
                <img 
                  src={steps[currentStep].image} 
                  alt={`Tutorial step ${currentStep + 1}`}
                  className="w-full rounded-lg mb-4"
                />
              )}
              
              {steps[currentStep].action && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="mr-2">✅</span> Try it yourself
                  </h3>
                  <p className="text-sm text-gray-700">{steps[currentStep].action}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                Skip Tutorial
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TutorialSystem;
