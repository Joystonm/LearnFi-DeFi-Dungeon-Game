import React, { useState, useEffect } from 'react';
import { useCompound } from '../context/CompoundContext';
import { useUser } from '../context/UserContext';

const MultiStepSimulation = () => {
  const { marketData, simulateSupply, simulateBorrow } = useCompound();
  const { user, updateBalance, recordSimulation } = useUser();
  
  // State for transaction steps
  const [steps, setSteps] = useState([
    { type: 'supply', token: 'DAI', amount: '', completed: false }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Available tokens
  const availableTokens = ['DAI', 'USDC', 'ETH', 'WBTC'];
  
  // Add a new step
  const addStep = () => {
    setSteps([...steps, { type: 'supply', token: 'DAI', amount: '', completed: false }]);
  };
  
  // Remove a step
  const removeStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
    
    // Adjust current step if needed
    if (currentStep >= newSteps.length) {
      setCurrentStep(Math.max(0, newSteps.length - 1));
    }
  };
  
  // Update step type
  const updateStepType = (index, type) => {
    const newSteps = [...steps];
    newSteps[index].type = type;
    setSteps(newSteps);
  };
  
  // Update step token
  const updateStepToken = (index, token) => {
    const newSteps = [...steps];
    newSteps[index].token = token;
    setSteps(newSteps);
  };
  
  // Update step amount
  const updateStepAmount = (index, amount) => {
    if (amount === '' || /^\d*\.?\d*$/.test(amount)) {
      const newSteps = [...steps];
      newSteps[index].amount = amount;
      setSteps(newSteps);
    }
  };
  
  // Execute all steps
  const executeAllSteps = async () => {
    setIsExecuting(true);
    setResults([]);
    setShowResults(false);
    
    // Reset completion status
    const resetSteps = steps.map(step => ({ ...step, completed: false }));
    setSteps(resetSteps);
    
    // Execute steps sequentially
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Execute current step
      const step = steps[i];
      const amount = parseFloat(step.amount);
      
      if (isNaN(amount) || amount <= 0) {
        setResults(prev => [...prev, {
          step: i + 1,
          type: step.type,
          token: step.token,
          amount: step.amount,
          success: false,
          message: 'Invalid amount'
        }]);
        continue;
      }
      
      try {
        let result;
        
        if (step.type === 'supply') {
          // Check if user has enough balance
          if (amount > user.balance[step.token]) {
            setResults(prev => [...prev, {
              step: i + 1,
              type: step.type,
              token: step.token,
              amount,
              success: false,
              message: `Insufficient ${step.token} balance`
            }]);
            continue;
          }
          
          // Simulate supply
          result = await simulateSupply(step.token, amount);
          
          if (result.success) {
            // Update user balance
            updateBalance(step.token, -amount);
            
            // Record the simulation
            recordSimulation({
              type: 'supply',
              token: step.token,
              amount
            });
            
            // Mark step as completed
            const newSteps = [...steps];
            newSteps[i].completed = true;
            setSteps(newSteps);
          }
        } else {
          // Simulate borrow
          result = await simulateBorrow(step.token, amount);
          
          if (result.success) {
            // Update user balance
            updateBalance(step.token, amount);
            
            // Record the simulation
            recordSimulation({
              type: 'borrow',
              token: step.token,
              amount
            });
            
            // Mark step as completed
            const newSteps = [...steps];
            newSteps[i].completed = true;
            setSteps(newSteps);
          }
        }
        
        // Add result
        setResults(prev => [...prev, {
          step: i + 1,
          type: step.type,
          token: step.token,
          amount,
          success: result.success,
          message: result.message
        }]);
        
        // Pause between steps
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        setResults(prev => [...prev, {
          step: i + 1,
          type: step.type,
          token: step.token,
          amount,
          success: false,
          message: error.message || 'An error occurred'
        }]);
      }
    }
    
    setIsExecuting(false);
    setShowResults(true);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-teal-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🔄</span> Multi-Step Transaction Simulation
        </h2>
        <p className="text-sm text-teal-100">
          Create and execute a sequence of supply and borrow transactions
        </p>
      </div>
      
      <div className="p-6">
        {showResults ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Simulation Results</h3>
            
            <div className="space-y-4 mb-6">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        result.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {result.success ? '✓' : '✗'}
                      </div>
                      <h4 className="font-medium">Step {result.step}: {result.type} {result.token}</h4>
                    </div>
                    <span className="text-sm font-medium">
                      {result.amount} {result.token}
                    </span>
                  </div>
                  <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.message}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Steps:</span>
                  <span className="font-medium">{results.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Successful Steps:</span>
                  <span className="font-medium text-green-600">
                    {results.filter(r => r.success).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Failed Steps:</span>
                  <span className="font-medium text-red-600">
                    {results.filter(r => !r.success).length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setShowResults(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Edit Steps
              </button>
              
              <button
                onClick={executeAllSteps}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Run Again
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">
              Create a sequence of supply and borrow transactions to simulate complex DeFi strategies.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Transaction Steps</h3>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      currentStep === index 
                        ? 'border-teal-500 bg-teal-50' 
                        : step.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : currentStep === index
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step.completed ? '✓' : index + 1}
                        </div>
                        <h4 className="font-medium">Step {index + 1}</h4>
                      </div>
                      
                      <button
                        onClick={() => removeStep(index)}
                        disabled={steps.length === 1 || isExecuting}
                        className={`text-gray-400 hover:text-gray-600 ${
                          steps.length === 1 || isExecuting ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Action
                        </label>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          <button
                            className={`flex-1 py-1 text-sm rounded-md transition-colors ${
                              step.type === 'supply' ? 'bg-white shadow-sm' : 'text-gray-600'
                            }`}
                            onClick={() => updateStepType(index, 'supply')}
                            disabled={isExecuting}
                          >
                            Supply
                          </button>
                          <button
                            className={`flex-1 py-1 text-sm rounded-md transition-colors ${
                              step.type === 'borrow' ? 'bg-white shadow-sm' : 'text-gray-600'
                            }`}
                            onClick={() => updateStepType(index, 'borrow')}
                            disabled={isExecuting}
                          >
                            Borrow
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Token
                        </label>
                        <select
                          value={step.token}
                          onChange={(e) => updateStepToken(index, e.target.value)}
                          disabled={isExecuting}
                          className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                        >
                          {availableTokens.map((token) => (
                            <option key={token} value={token}>{token}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Amount
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={step.amount}
                            onChange={(e) => updateStepAmount(index, e.target.value)}
                            disabled={isExecuting}
                            placeholder="Enter amount"
                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm"
                          />
                          <div className="absolute right-3 top-2 text-xs text-gray-500">
                            {step.token}
                          </div>
                        </div>
                        
                        {step.type === 'supply' && (
                          <div className="mt-1 text-xs text-gray-500">
                            Balance: {user.balance[step.token]} {step.token}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button
                  onClick={addStep}
                  disabled={isExecuting}
                  className={`flex items-center text-teal-600 hover:text-teal-800 ${
                    isExecuting ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Step
                </button>
              </div>
            </div>
            
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2 flex items-center">
                <span className="mr-2">💡</span> Strategy Preview
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                You're creating a {steps.length}-step strategy:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                {steps.map((step, index) => (
                  <li key={index}>
                    {step.type === 'supply' ? 'Supply' : 'Borrow'} {step.amount || '?'} {step.token}
                  </li>
                ))}
              </ol>
            </div>
            
            <button
              onClick={executeAllSteps}
              disabled={isExecuting || steps.some(step => !step.amount || parseFloat(step.amount) <= 0)}
              className={`w-full py-3 rounded-lg ${
                isExecuting || steps.some(step => !step.amount || parseFloat(step.amount) <= 0)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {isExecuting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing Transactions...
                </span>
              ) : (
                'Execute All Steps'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepSimulation;
