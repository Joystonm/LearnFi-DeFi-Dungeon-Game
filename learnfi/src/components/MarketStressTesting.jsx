import React, { useState, useEffect } from 'react';
import { useCompound } from '../context/CompoundContext';
import { useUser } from '../context/UserContext';

const MarketStressTesting = () => {
  const { marketData, userCompound } = useCompound();
  const { user } = useUser();
  
  // State for stress test parameters
  const [scenario, setScenario] = useState('crash');
  const [intensity, setIntensity] = useState(30); // percentage
  const [duration, setDuration] = useState(30); // days
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Predefined scenarios
  const scenarios = [
    { id: 'crash', name: 'Market Crash', description: 'Simulate a sudden drop in asset prices' },
    { id: 'spike', name: 'Market Spike', description: 'Simulate a sudden increase in asset prices' },
    { id: 'volatility', name: 'High Volatility', description: 'Simulate price fluctuations over time' },
    { id: 'liquidity', name: 'Liquidity Crisis', description: 'Simulate reduced market liquidity and higher rates' }
  ];
  
  // Run stress test
  const runStressTest = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Calculate impact based on scenario and intensity
      const impactFactor = intensity / 100;
      
      // Clone market data for simulation
      const simulatedMarkets = marketData.map(market => ({
        ...market,
        // Apply price changes based on scenario
        price: scenario === 'crash' 
          ? market.price * (1 - impactFactor)
          : scenario === 'spike'
          ? market.price * (1 + impactFactor)
          : market.price,
        // Adjust interest rates based on scenario
        supplyApy: scenario === 'liquidity' 
          ? market.supplyApy * (1 + impactFactor * 2)
          : scenario === 'crash'
          ? market.supplyApy * (1 - impactFactor / 2)
          : market.supplyApy,
        borrowApy: scenario === 'liquidity' 
          ? market.borrowApy * (1 + impactFactor * 3)
          : scenario === 'crash'
          ? market.borrowApy * (1 + impactFactor)
          : market.borrowApy
      }));
      
      // Calculate user position impact
      let totalSuppliedValueBefore = 0;
      let totalSuppliedValueAfter = 0;
      let adjustedSuppliedValueBefore = 0;
      let adjustedSuppliedValueAfter = 0;
      let totalBorrowedValueBefore = 0;
      let totalBorrowedValueAfter = 0;
      let healthFactorBefore = 0;
      let healthFactorAfter = 0;
      
      // Calculate supplied values
      Object.entries(userCompound.supplied).forEach(([symbol, amount]) => {
        const marketBefore = marketData.find(m => m.symbol === symbol);
        const marketAfter = simulatedMarkets.find(m => m.symbol === symbol);
        
        if (marketBefore && marketAfter) {
          const valueBefore = amount * marketBefore.price;
          const valueAfter = amount * marketAfter.price;
          
          totalSuppliedValueBefore += valueBefore;
          totalSuppliedValueAfter += valueAfter;
          
          // Apply collateral factor for adjusted values
          adjustedSuppliedValueBefore += valueBefore * marketBefore.collateralFactor;
          adjustedSuppliedValueAfter += valueAfter * marketAfter.collateralFactor;
        }
      });
      
      // Calculate borrowed values
      Object.entries(userCompound.borrowed).forEach(([symbol, amount]) => {
        const marketBefore = marketData.find(m => m.symbol === symbol);
        const marketAfter = simulatedMarkets.find(m => m.symbol === symbol);
        
        if (marketBefore && marketAfter) {
          totalBorrowedValueBefore += amount * marketBefore.price;
          totalBorrowedValueAfter += amount * marketAfter.price;
        }
      });
      
      // Calculate health factors
      if (totalBorrowedValueBefore > 0) {
        healthFactorBefore = (adjustedSuppliedValueBefore / totalBorrowedValueBefore) * 100;
      } else {
        healthFactorBefore = 100; // No borrows means no risk
      }
      
      if (totalBorrowedValueAfter > 0) {
        healthFactorAfter = (adjustedSuppliedValueAfter / totalBorrowedValueAfter) * 100;
      } else {
        healthFactorAfter = 100; // No borrows means no risk
      }
      
      // Check for liquidation
      const liquidationRisk = healthFactorAfter < 100;
      
      // Calculate interest earned/paid over duration
      const daysInYear = 365;
      const durationFraction = duration / daysInYear;
      
      let interestEarned = 0;
      let interestPaid = 0;
      
      // Calculate interest earned on supplied assets
      Object.entries(userCompound.supplied).forEach(([symbol, amount]) => {
        const market = simulatedMarkets.find(m => m.symbol === symbol);
        if (market) {
          // Calculate interest based on the new price and APY after the scenario
          interestEarned += amount * market.price * (market.supplyApy / 100) * durationFraction;
        }
      });
      
      // Calculate interest paid on borrowed assets
      Object.entries(userCompound.borrowed).forEach(([symbol, amount]) => {
        const market = simulatedMarkets.find(m => m.symbol === symbol);
        if (market) {
          // Calculate interest based on the new price and APY after the scenario
          interestPaid += amount * market.price * (market.borrowApy / 100) * durationFraction;
        }
      });
      
      // Set results
      setResults({
        scenario,
        intensity,
        duration,
        marketsBefore: marketData,
        marketsAfter: simulatedMarkets,
        suppliedValueBefore: totalSuppliedValueBefore,
        suppliedValueAfter: totalSuppliedValueAfter,
        adjustedSuppliedValueBefore: adjustedSuppliedValueBefore,
        adjustedSuppliedValueAfter: adjustedSuppliedValueAfter,
        borrowedValueBefore: totalBorrowedValueBefore,
        borrowedValueAfter: totalBorrowedValueAfter,
        healthFactorBefore: healthFactorBefore,
        healthFactorAfter: healthFactorAfter,
        liquidationRisk,
        interestEarned,
        interestPaid,
        netInterest: interestEarned - interestPaid
      });
      
      setIsLoading(false);
    }, 1500);
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
  
  // Reset results
  const resetResults = () => {
    setResults(null);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-purple-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🧪</span> Market Stress Testing
        </h2>
        <p className="text-sm text-purple-100">
          Simulate how market conditions would affect your Compound position
        </p>
      </div>
      
      <div className="p-6">
        {results ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Stress Test Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Scenario</h4>
                <p className="font-medium">{scenarios.find(s => s.id === results.scenario)?.name}</p>
                <p className="text-sm text-gray-600">
                  {intensity}% intensity over {duration} days
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${
                results.liquidationRisk ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Liquidation Risk</h4>
                <p className={`font-medium ${
                  results.liquidationRisk ? 'text-red-600' : 'text-green-600'
                }`}>
                  {results.liquidationRisk ? 'High Risk' : 'Low Risk'}
                </p>
                <p className="text-sm text-gray-600">
                  Health factor: {results.healthFactorAfter.toFixed(2)}%
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Position Value Changes</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Supplied Value (Before)</p>
                    <p className="font-medium">{formatCurrency(results.suppliedValueBefore)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Supplied Value (After)</p>
                    <p className="font-medium">{formatCurrency(results.suppliedValueAfter)}</p>
                    <p className={`text-xs ${
                      results.suppliedValueAfter >= results.suppliedValueBefore 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {results.suppliedValueAfter >= results.suppliedValueBefore ? '+' : ''}
                      {((results.suppliedValueAfter - results.suppliedValueBefore) / 
                        results.suppliedValueBefore * 100).toFixed(2)}%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Borrowed Value (Before)</p>
                    <p className="font-medium">{formatCurrency(results.borrowedValueBefore)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Borrowed Value (After)</p>
                    <p className="font-medium">{formatCurrency(results.borrowedValueAfter)}</p>
                    <p className={`text-xs ${
                      results.borrowedValueAfter <= results.borrowedValueBefore 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {results.borrowedValueAfter <= results.borrowedValueBefore ? '' : '+'}
                      {((results.borrowedValueAfter - results.borrowedValueBefore) / 
                        results.borrowedValueBefore * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Health Factor Changes</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Health Factor (Before)</p>
                    <p className={`font-medium ${
                      results.healthFactorBefore >= 100 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {results.healthFactorBefore.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Health Factor (After)</p>
                    <p className={`font-medium ${
                      results.healthFactorAfter >= 100 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {results.healthFactorAfter.toFixed(2)}%
                    </p>
                    <p className={`text-xs ${
                      results.healthFactorAfter >= results.healthFactorBefore 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {results.healthFactorAfter >= results.healthFactorBefore ? '+' : ''}
                      {((results.healthFactorAfter - results.healthFactorBefore) / 
                        results.healthFactorBefore * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Liquidation Risk</p>
                  <div className={`p-2 rounded-lg ${
                    results.liquidationRisk ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <p className={`text-sm ${
                      results.liquidationRisk ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {results.liquidationRisk 
                        ? 'Your position would be at risk of liquidation in this scenario.' 
                        : 'Your position would remain safe from liquidation in this scenario.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Interest Over {duration} Days</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Interest Earned</p>
                    <p className="font-medium text-green-600">{formatCurrency(results.interestEarned)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Paid</p>
                    <p className="font-medium text-red-600">{formatCurrency(results.interestPaid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Interest</p>
                    <p className={`font-medium ${
                      results.netInterest >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(results.netInterest)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Market Changes</h4>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Asset</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Price Before</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Price After</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Supply APY</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Borrow APY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.marketsAfter.map((market, index) => {
                      const marketBefore = results.marketsBefore.find(m => m.symbol === market.symbol);
                      return (
                        <tr key={market.symbol} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-2 text-sm font-medium">{market.symbol}</td>
                          <td className="py-2 text-sm text-right">${marketBefore.price.toFixed(2)}</td>
                          <td className="py-2 text-sm text-right">
                            ${market.price.toFixed(2)}
                            <span className={`ml-1 text-xs ${
                              market.price >= marketBefore.price ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {market.price >= marketBefore.price ? '+' : ''}
                              {((market.price - marketBefore.price) / marketBefore.price * 100).toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-2 text-sm text-right">
                            {market.supplyApy.toFixed(2)}%
                            <span className={`ml-1 text-xs ${
                              market.supplyApy >= marketBefore.supplyApy ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {market.supplyApy >= marketBefore.supplyApy ? '+' : ''}
                              {((market.supplyApy - marketBefore.supplyApy) / marketBefore.supplyApy * 100).toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-2 text-sm text-right">
                            {market.borrowApy.toFixed(2)}%
                            <span className={`ml-1 text-xs ${
                              market.borrowApy <= marketBefore.borrowApy ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {market.borrowApy <= marketBefore.borrowApy ? '' : '+'}
                              {((market.borrowApy - marketBefore.borrowApy) / marketBefore.borrowApy * 100).toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={resetResults}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Run Another Test
              </button>
              
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save Results
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">
              Test how your Compound position would perform under different market conditions.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Scenario
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scenarios.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      scenario === s.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setScenario(s.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${
                        scenario === s.id ? 'bg-purple-500' : 'bg-gray-200'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{s.name}</h4>
                        <p className="text-xs text-gray-500">{s.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity: {intensity}%
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mild (10%)</span>
                <span>Severe (90%)</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration: {duration} days
              </label>
              <input
                type="range"
                min="1"
                max="90"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 day</span>
                <span>90 days</span>
              </div>
            </div>
            
            <button
              onClick={runStressTest}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Simulation...
                </span>
              ) : (
                'Run Stress Test'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketStressTesting;
