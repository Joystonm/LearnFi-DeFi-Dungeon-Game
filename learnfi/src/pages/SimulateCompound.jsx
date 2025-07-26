import React, { useState } from 'react';
import { useCompound } from '../context/CompoundContext';
import { useUser } from '../context/UserContext';

const SimulateCompound = () => {
  // Get context data
  const { marketData, isLoading, simulateSupply, simulateBorrow, userCompound } = useCompound();
  const { user, updateBalance, recordSimulation, addBadge } = useUser();
  
  // State for simulation form
  const [action, setAction] = useState('supply');
  const [selectedToken, setSelectedToken] = useState('DAI');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  
  // Available tokens
  const availableTokens = ['DAI', 'USDC', 'ETH', 'WBTC'];
  
  // Handle token selection
  const handleTokenSelect = (token) => {
    setSelectedToken(token);
    setError('');
  };
  
  // Handle amount input
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Check if user has enough balance for supply
    if (action === 'supply') {
      if (parseFloat(amount) > user.balance[selectedToken]) {
        setError(`You don't have enough ${selectedToken} to supply this amount`);
        return;
      }
      
      // Simulate supply
      const result = await simulateSupply(selectedToken, parseFloat(amount));
      
      if (result.success) {
        // Update user balance
        updateBalance(selectedToken, -parseFloat(amount));
        
        // Record the simulation
        recordSimulation({
          type: 'supply',
          token: selectedToken,
          amount: parseFloat(amount)
        });
        
        // Show success message
        setSuccess(`Successfully supplied ${amount} ${selectedToken}`);
        
        // Check if this is the first supply
        if (!user.badges.some(b => b.id === 'first_supply')) {
          const newBadge = {
            id: 'first_supply',
            name: 'First Supply',
            type: 'simulation',
            description: 'Supplied your first asset to Compound'
          };
          
          addBadge(newBadge);
          setEarnedBadge(newBadge);
          
          // Show badge after animation
          setTimeout(() => {
            setShowBadge(true);
          }, 1000);
        }
      } else {
        setError(result.message);
      }
    } else {
      // Simulate borrow
      const result = await simulateBorrow(selectedToken, parseFloat(amount));
      
      if (result.success) {
        // Update user balance
        updateBalance(selectedToken, parseFloat(amount));
        
        // Record the simulation
        recordSimulation({
          type: 'borrow',
          token: selectedToken,
          amount: parseFloat(amount)
        });
        
        // Show success message
        setSuccess(`Successfully borrowed ${amount} ${selectedToken}`);
        
        // Check if this is the first borrow
        if (!user.badges.some(b => b.id === 'first_borrow')) {
          const newBadge = {
            id: 'first_borrow',
            name: 'First Borrow',
            type: 'simulation',
            description: 'Borrowed your first asset from Compound'
          };
          
          addBadge(newBadge);
          setEarnedBadge(newBadge);
          
          // Show badge after animation
          setTimeout(() => {
            setShowBadge(true);
          }, 1000);
        }
      } else {
        setError(result.message);
      }
    }
    
    // Reset form
    setAmount('');
  };
  
  // Get token details
  const getTokenDetails = (symbol) => {
    const market = marketData.find(m => m.symbol === symbol);
    
    return {
      supplyApy: market ? market.supplyApy : 0,
      borrowApy: market ? market.borrowApy : 0,
      collateralFactor: market ? market.collateralFactor * 100 : 0
    };
  };
  
  // Calculate borrow limit based on supplied assets and their collateral factors
  const calculateBorrowLimit = () => {
    let borrowLimit = 0;
    
    // Calculate for each supplied asset: amount * price * collateral factor
    Object.entries(userCompound.supplied).forEach(([symbol, amount]) => {
      const market = marketData.find(m => m.symbol === symbol);
      if (market) {
        borrowLimit += amount * market.price * market.collateralFactor;
      }
    });
    
    return borrowLimit.toFixed(2);
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Simulate Compound</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Simulation Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">
            {action === 'supply' ? 'Supply Assets' : 'Borrow Assets'}
          </h2>
          
          {/* Action Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 rounded-md transition-colors ${
                action === 'supply' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setAction('supply')}
            >
              Supply
            </button>
            <button
              className={`flex-1 py-2 rounded-md transition-colors ${
                action === 'borrow' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setAction('borrow')}
            >
              Borrow
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Token Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Token
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableTokens.map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => handleTokenSelect(token)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedToken === token
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-1">
                        {token === 'DAI' && '💰'}
                        {token === 'USDC' && '💵'}
                        {token === 'ETH' && '💎'}
                        {token === 'WBTC' && '🔶'}
                      </span>
                      <span className="font-medium">{token}</span>
                      <span className="text-xs text-gray-500">
                        {action === 'supply' ? 
                          `${getTokenDetails(token).supplyApy.toFixed(2)}% APY` : 
                          `${getTokenDetails(token).borrowApy.toFixed(2)}% APY`
                        }
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${selectedToken} amount`}
                />
                <div className="absolute right-3 top-3 text-gray-500">
                  {action === 'supply' && (
                    <button
                      type="button"
                      onClick={() => setAmount(user.balance[selectedToken].toString())}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Max: {user.balance[selectedToken]}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Token Info */}
              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-1">Collateral Factor:</span>
                  <span className="font-medium">{getTokenDetails(selectedToken).collateralFactor.toFixed(0)}%</span>
                </div>
                <div>
                  {action === 'supply' ? 
                    `Your balance: ${user.balance[selectedToken]} ${selectedToken}` : 
                    `Borrow limit: ${calculateBorrowLimit()} USD`
                  }
                </div>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                {success}
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {action === 'supply' ? 'Supply' : 'Borrow'} {selectedToken}
            </button>
          </form>
        </div>
        
        {/* Visualization */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Compound Simulation</h2>
          
          {/* Animation Container */}
          <div className="flex-grow relative border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
            {/* User Wallet */}
            <div className="absolute top-4 left-4 right-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Your Wallet</h3>
              <div className="space-y-1">
                {Object.entries(user.balance).map(([token, balance]) => (
                  <div key={token} className="flex justify-between">
                    <span className="text-sm">{token}</span>
                    <span className="text-sm font-medium">{balance.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Compound Pool */}
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Your Compound Position</h3>
              {Object.keys(userCompound.supplied).length > 0 ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs text-gray-500">Supplied</h4>
                    {Object.entries(userCompound.supplied).map(([token, amount]) => (
                      <div key={token} className="flex justify-between">
                        <span className="text-sm">{token}</span>
                        <span className="text-sm font-medium">{amount.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {Object.keys(userCompound.borrowed).length > 0 && (
                    <div>
                      <h4 className="text-xs text-gray-500">Borrowed</h4>
                      {Object.entries(userCompound.borrowed).map(([token, amount]) => (
                        <div key={token} className="flex justify-between">
                          <span className="text-sm">{token}</span>
                          <span className="text-sm font-medium">{amount.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Health Factor</span>
                      <span 
                        className={`text-xs font-medium ${
                          userCompound.health > 50 ? 'text-green-600' : 
                          userCompound.health > 25 ? 'text-yellow-600' : 'text-red-600'
                        }`}
                      >
                        {userCompound.health.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          userCompound.health > 50 ? 'bg-green-500' : 
                          userCompound.health > 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${userCompound.health}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">You haven't supplied any assets yet</p>
              )}
            </div>
          </div>
          
          {/* Explanation */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <span className="mr-2">💡</span> How it works
            </h3>
            <p className="text-sm text-gray-700">
              {action === 'supply' ? 
                'When you supply assets to Compound, you receive cTokens in return. These tokens automatically earn interest through their exchange rate, which increases over time.' : 
                'When you borrow assets from Compound, you need to have supplied collateral first. The amount you can borrow depends on the collateral factor of your supplied assets.'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Badge Reward Modal */}
      {showBadge && earnedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 Badge Earned!</h2>
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-4xl">
                🏆
              </div>
              <h3 className="text-xl font-bold mt-4">{earnedBadge.name}</h3>
              <p className="text-gray-600 mt-2">{earnedBadge.description}</p>
            </div>
            <button
              onClick={() => setShowBadge(false)}
              className="btn btn-primary px-8 py-2"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulateCompound;
