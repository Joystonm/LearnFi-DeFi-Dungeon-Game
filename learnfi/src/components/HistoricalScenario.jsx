import React, { useState } from 'react';
import { useCompound } from '../context/CompoundContext';
import { useUser } from '../context/UserContext';

// Historical scenarios data
const historicalScenarios = [
  {
    id: 'eth_bull_2021',
    name: 'ETH Bull Run 2021',
    description: 'ETH price increased from $730 to $4,800 between January and November 2021',
    asset: 'ETH',
    startDate: 'January 2021',
    endDate: 'November 2021',
    startPrice: 730,
    endPrice: 4800,
    priceChange: 557.53,
    supplyApyRange: [0.15, 0.45],
    borrowApyRange: [1.2, 3.5],
    details: 'During this period, ETH saw massive price appreciation as institutional adoption increased and the DeFi ecosystem expanded rapidly. Supply APYs remained relatively low while borrow rates fluctuated based on demand.'
  },
  {
    id: 'crypto_crash_2022',
    name: 'Crypto Market Crash 2022',
    description: 'BTC price fell from $47,700 to $16,500 between January and November 2022',
    asset: 'WBTC',
    startDate: 'January 2022',
    endDate: 'November 2022',
    startPrice: 47700,
    endPrice: 16500,
    priceChange: -65.41,
    supplyApyRange: [0.1, 0.3],
    borrowApyRange: [1.5, 4.2],
    details: 'The 2022 crypto winter saw significant price declines across all major cryptocurrencies. Despite the price drop, Compound remained solvent due to its overcollateralization model, though many users faced liquidations.'
  },
  {
    id: 'stablecoin_depegging_2023',
    name: 'Stablecoin Depegging Event',
    description: 'USDC temporarily depegged from $1.00 to $0.87 in March 2023',
    asset: 'USDC',
    startDate: 'March 10, 2023',
    endDate: 'March 13, 2023',
    startPrice: 1.00,
    endPrice: 0.87,
    priceChange: -13.00,
    supplyApyRange: [1.2, 4.8],
    borrowApyRange: [3.5, 12.5],
    details: 'Following the collapse of Silicon Valley Bank, USDC temporarily lost its peg to the US dollar. This led to significant volatility in DeFi markets, with supply and borrow rates spiking as users rushed to adjust their positions.'
  },
  {
    id: 'defi_summer_2020',
    name: 'DeFi Summer 2020',
    description: 'Explosive growth in DeFi protocols and yield farming',
    asset: 'DAI',
    startDate: 'June 2020',
    endDate: 'September 2020',
    startPrice: 1.00,
    endPrice: 1.01,
    priceChange: 1.00,
    supplyApyRange: [3.5, 12.0],
    borrowApyRange: [5.0, 20.0],
    details: 'The "DeFi Summer" of 2020 saw unprecedented growth in total value locked across DeFi protocols. Yield farming became popular, driving up both supply and borrow rates as users sought to maximize returns through complex strategies.'
  }
];

const HistoricalScenario = () => {
  const { marketData } = useCompound();
  const { user } = useUser();
  
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [simulationAmount, setSimulationAmount] = useState('');
  const [simulationAction, setSimulationAction] = useState('supply');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle scenario selection
  const selectScenario = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setResults(null);
  };
  
  // Handle amount input
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSimulationAmount(value);
    }
  };
  
  // Run historical simulation
  const runSimulation = () => {
    if (!selectedScenario || !simulationAmount || parseFloat(simulationAmount) <= 0) {
      return;
    }
    
    setIsLoading(true);
    
    // Get selected scenario data
    const scenario = historicalScenarios.find(s => s.id === selectedScenario);
    
    // Simulate API delay
    setTimeout(() => {
      // Calculate results based on scenario
      const amount = parseFloat(simulationAmount);
      
      if (simulationAction === 'supply') {
        // Calculate supply results
        const startValue = amount * scenario.startPrice;
        const endValue = amount * scenario.endPrice;
        const valueChange = endValue - startValue;
        
        // Calculate average APY during period
        const avgSupplyApy = (scenario.supplyApyRange[0] + scenario.supplyApyRange[1]) / 2;
        
        // Estimate duration in days
        const durationDays = estimateDurationDays(scenario.startDate, scenario.endDate);
        
        // Calculate interest earned (simplified)
        const interestEarned = startValue * (avgSupplyApy / 100) * (durationDays / 365);
        
        // Total return
        const totalReturn = valueChange + interestEarned;
        const totalReturnPercentage = (totalReturn / startValue) * 100;
        
        setResults({
          scenario,
          action: 'supply',
          amount,
          startValue,
          endValue,
          valueChange,
          valueChangePercentage: (valueChange / startValue) * 100,
          interestEarned,
          interestEarnedPercentage: (interestEarned / startValue) * 100,
          totalReturn,
          totalReturnPercentage,
          profitable: totalReturn > 0
        });
      } else {
        // Calculate borrow results
        const startDebt = amount * scenario.startPrice;
        const endDebt = amount * scenario.endPrice;
        const debtChange = endDebt - startDebt;
        
        // Calculate average APY during period
        const avgBorrowApy = (scenario.borrowApyRange[0] + scenario.borrowApyRange[1]) / 2;
        
        // Estimate duration in days
        const durationDays = estimateDurationDays(scenario.startDate, scenario.endDate);
        
        // Calculate interest paid (simplified)
        const interestPaid = startDebt * (avgBorrowApy / 100) * (durationDays / 365);
        
        // Total cost
        const totalCost = debtChange + interestPaid;
        const totalCostPercentage = (totalCost / startDebt) * 100;
        
        setResults({
          scenario,
          action: 'borrow',
          amount,
          startDebt,
          endDebt,
          debtChange,
          debtChangePercentage: (debtChange / startDebt) * 100,
          interestPaid,
          interestPaidPercentage: (interestPaid / startDebt) * 100,
          totalCost,
          totalCostPercentage,
          profitable: debtChange < 0 && Math.abs(debtChange) > interestPaid
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Helper function to estimate duration in days between two date strings
  const estimateDurationDays = (startDate, endDate) => {
    // This is a simplified estimation
    const monthMap = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    const parseDate = (dateStr) => {
      const parts = dateStr.split(' ');
      const month = monthMap[parts[0]];
      const year = parseInt(parts[1]);
      return new Date(year, month, 15); // Using middle of month as approximation
    };
    
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
      <div className="bg-indigo-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🕰️</span> Historical Scenario Replay
        </h2>
        <p className="text-sm text-indigo-100">
          See how your strategy would have performed during historical market events
        </p>
      </div>
      
      <div className="p-6">
        {results ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Simulation Results</h3>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">{results.scenario.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{results.scenario.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Asset:</span> {results.scenario.asset}
                </div>
                <div>
                  <span className="text-gray-500">Period:</span> {results.scenario.startDate} - {results.scenario.endDate}
                </div>
                <div>
                  <span className="text-gray-500">Price Change:</span> {results.scenario.priceChange.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Your Strategy</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Action:</span>
                    <span className="font-medium capitalize">{results.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{results.amount} {results.scenario.asset}</span>
                  </div>
                  {results.action === 'supply' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Initial Value:</span>
                        <span className="font-medium">{formatCurrency(results.startValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Final Value:</span>
                        <span className="font-medium">{formatCurrency(results.endValue)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Initial Debt:</span>
                        <span className="font-medium">{formatCurrency(results.startDebt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Final Debt:</span>
                        <span className="font-medium">{formatCurrency(results.endDebt)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${results.profitable ? 'bg-green-50' : 'bg-red-50'}`}>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Outcome</h4>
                <div className="space-y-2">
                  {results.action === 'supply' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value Change:</span>
                        <span className={`font-medium ${results.valueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(results.valueChange)} ({results.valueChangePercentage.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Earned:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(results.interestEarned)} ({results.interestEarnedPercentage.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                        <span className="text-gray-600">Total Return:</span>
                        <span className={`font-medium ${results.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(results.totalReturn)} ({results.totalReturnPercentage.toFixed(2)}%)
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Debt Change:</span>
                        <span className={`font-medium ${results.debtChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(results.debtChange)} ({results.debtChangePercentage.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Paid:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(results.interestPaid)} ({results.interestPaidPercentage.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                        <span className="text-gray-600">Total Cost/Gain:</span>
                        <span className={`font-medium ${results.totalCost <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(results.totalCost))} ({results.totalCostPercentage.toFixed(2)}%)
                          {results.totalCost <= 0 ? ' gain' : ' cost'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Analysis</h4>
              <p className="text-sm text-gray-600 mb-4">{results.scenario.details}</p>
              
              <h5 className="text-sm font-medium text-gray-500 mb-2">Key Takeaways</h5>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {results.action === 'supply' ? (
                  results.profitable ? (
                    <>
                      <li>Supplying {results.scenario.asset} during this period was profitable.</li>
                      <li>The combination of {results.valueChange >= 0 ? 'price appreciation' : 'interest earned'} outweighed {results.valueChange >= 0 ? 'other factors' : 'price depreciation'}.</li>
                      <li>This strategy yielded a {results.totalReturnPercentage.toFixed(2)}% return over the period.</li>
                    </>
                  ) : (
                    <>
                      <li>Supplying {results.scenario.asset} during this period resulted in a loss.</li>
                      <li>The {Math.abs(results.valueChange) > results.interestEarned ? 'price depreciation' : 'low interest rates'} was the main factor in this outcome.</li>
                      <li>This strategy resulted in a {Math.abs(results.totalReturnPercentage).toFixed(2)}% loss over the period.</li>
                    </>
                  )
                ) : (
                  results.profitable ? (
                    <>
                      <li>Borrowing {results.scenario.asset} during this period was profitable.</li>
                      <li>The price depreciation of {results.scenario.asset} exceeded the interest costs.</li>
                      <li>This strategy yielded a {Math.abs(results.totalCostPercentage).toFixed(2)}% gain over the period.</li>
                    </>
                  ) : (
                    <>
                      <li>Borrowing {results.scenario.asset} during this period resulted in a cost.</li>
                      <li>The {results.debtChange > 0 ? 'price appreciation' : 'interest costs'} was the main factor in this outcome.</li>
                      <li>This strategy resulted in a {results.totalCostPercentage.toFixed(2)}% cost over the period.</li>
                    </>
                  )
                )}
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setResults(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Try Another Scenario
              </button>
              
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Results
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">
              Explore how your strategy would have performed during significant historical market events.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Historical Scenario
              </label>
              <div className="space-y-3">
                {historicalScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedScenario === scenario.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => selectScenario(scenario.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        selectedScenario === scenario.id ? 'bg-indigo-500' : 'bg-gray-200'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-xs text-gray-500">{scenario.description}</p>
                        <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-gray-500">
                          <span>Asset: {scenario.asset}</span>
                          <span>Period: {scenario.startDate} - {scenario.endDate}</span>
                          <span className={scenario.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            Price Change: {scenario.priceChange.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedScenario && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Action
                  </label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`flex-1 py-2 rounded-md transition-colors ${
                        simulationAction === 'supply' ? 'bg-white shadow-sm' : 'text-gray-600'
                      }`}
                      onClick={() => setSimulationAction('supply')}
                    >
                      Supply
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-md transition-colors ${
                        simulationAction === 'borrow' ? 'bg-white shadow-sm' : 'text-gray-600'
                      }`}
                      onClick={() => setSimulationAction('borrow')}
                    >
                      Borrow
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Amount
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={simulationAmount}
                      onChange={handleAmountChange}
                      placeholder={`Amount of ${historicalScenarios.find(s => s.id === selectedScenario)?.asset}`}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="absolute right-3 top-3 text-gray-500">
                      {historicalScenarios.find(s => s.id === selectedScenario)?.asset}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={runSimulation}
                  disabled={isLoading || !simulationAmount || parseFloat(simulationAmount) <= 0}
                  className={`w-full py-3 rounded-lg ${
                    isLoading || !simulationAmount || parseFloat(simulationAmount) <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
                    'Run Historical Simulation'
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalScenario;
