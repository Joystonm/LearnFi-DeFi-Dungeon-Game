import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const TryItYourself = ({ 
  title, 
  description, 
  steps, 
  onComplete,
  badgeId = null,
  badgeName = null,
  badgeDescription = null
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(Array(steps.length).fill(false));
  const [showSuccess, setShowSuccess] = useState(false);
  const { addBadge } = useUser();

  // Mark a step as completed
  const completeStep = (index) => {
    const newCompleted = [...completed];
    newCompleted[index] = true;
    setCompleted(newCompleted);
    
    // Check if all steps are completed
    if (newCompleted.every(step => step)) {
      setShowSuccess(true);
      
      // Award badge if provided
      if (badgeId && badgeName && badgeDescription) {
        const badge = {
          id: badgeId,
          name: badgeName,
          type: 'achievement',
          description: badgeDescription
        };
        addBadge(badge);
      }
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Move to the next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to the previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">🔍</span> {title}
        </h3>
        <p className="text-sm text-blue-100">{description}</p>
      </div>
      
      <div className="p-4">
        {showSuccess ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-xl font-bold mb-2">Great job!</h4>
            <p className="text-gray-600 mb-4">
              You've successfully completed all the steps.
            </p>
            {badgeId && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 font-medium">
                  You earned the "{badgeName}" badge!
                </p>
              </div>
            )}
            <button
              onClick={() => setShowSuccess(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm text-gray-500">
                  {completed.filter(Boolean).length} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(completed.filter(Boolean).length / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Current step */}
            <div className="mb-6">
              <div className="flex items-start mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  completed[currentStep] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {completed[currentStep] ? '✓' : currentStep + 1}
                </div>
                <h4 className="font-medium">{steps[currentStep].title}</h4>
              </div>
              
              <div className="ml-9">
                <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
                
                {steps[currentStep].image && (
                  <img 
                    src={steps[currentStep].image} 
                    alt={steps[currentStep].title}
                    className="w-full rounded-lg mb-4"
                  />
                )}
                
                {steps[currentStep].component && (
                  <div className="mb-4">
                    {steps[currentStep].component}
                  </div>
                )}
                
                <div className="flex justify-between mt-4">
                  <div>
                    {currentStep > 0 && (
                      <button
                        onClick={prevStep}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        ← Previous
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    {!completed[currentStep] && (
                      <button
                        onClick={() => completeStep(currentStep)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Mark as Completed
                      </button>
                    )}
                    
                    {currentStep < steps.length - 1 && (
                      <button
                        onClick={nextStep}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        Next Step
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TryItYourself;
