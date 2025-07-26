import React, { useState } from 'react';
import { useCompound } from '../context/CompoundContext';

const MarketData = () => {
  const { marketData, isLoading } = useCompound();
  const [selectedMarket, setSelectedMarket] = useState(null);
  
  // Format large numbers with abbreviations
  const formatNumber = (num) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Compound Market Data</h1>
      
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {marketData.map((market) => (
              <div
                key={market.symbol}
                className={`p-4 rounded-xl shadow-md transition-colors cursor-pointer ${
                  selectedMarket?.symbol === market.symbol
                    ? 'bg-blue-50 border-2 border-blue-300'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMarket(market)}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    {market.symbol === 'DAI' && '💰'}
                    {market.symbol === 'USDC' && '💵'}
                    {market.symbol === 'ETH' && '💎'}
                    {market.symbol === 'WBTC' && '🔶'}
                    {!['DAI', 'USDC', 'ETH', 'WBTC'].includes(market.symbol) && '🪙'}
                  </div>
                  <div>
                    <h3 className="font-medium">{market.symbol}</h3>
                    <p className="text-xs text-gray-500">{market.name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Supply APY</p>
                    <p className="font-medium text-green-600">{market.supplyApy.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Borrow APY</p>
                    <p className="font-medium text-red-600">{market.borrowApy.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Selected Market Details */}
          {selectedMarket && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mr-4">
                    {selectedMarket.symbol === 'DAI' && '💰'}
                    {selectedMarket.symbol === 'USDC' && '💵'}
                    {selectedMarket.symbol === 'ETH' && '💎'}
                    {selectedMarket.symbol === 'WBTC' && '🔶'}
                    {!['DAI', 'USDC', 'ETH', 'WBTC'].includes(selectedMarket.symbol) && '🪙'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMarket.symbol}</h2>
                    <p className="text-gray-600">{selectedMarket.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-right mr-6">
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-xl font-bold">${selectedMarket.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Collateral Factor</p>
                    <p className="text-xl font-bold">{(selectedMarket.collateralFactor * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
              
              {/* Market Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">Total Supply</p>
                  </div>
                  <p className="text-lg font-bold">{formatNumber(selectedMarket.totalSupply)} {selectedMarket.symbol}</p>
                  <p className="text-sm text-gray-500">${formatNumber(selectedMarket.totalSupply * selectedMarket.price)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">Total Borrow</p>
                  </div>
                  <p className="text-lg font-bold">{formatNumber(selectedMarket.totalBorrow)} {selectedMarket.symbol}</p>
                  <p className="text-sm text-gray-500">${formatNumber(selectedMarket.totalBorrow * selectedMarket.price)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">Utilization Rate</p>
                  </div>
                  <p className="text-lg font-bold">
                    {selectedMarket.totalSupply > 0 
                      ? ((selectedMarket.totalBorrow / selectedMarket.totalSupply) * 100).toFixed(2) 
                      : '0.00'}%
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">Exchange Rate</p>
                  </div>
                  <p className="text-lg font-bold">1 c{selectedMarket.symbol} = {selectedMarket.exchangeRate.toFixed(6)} {selectedMarket.symbol}</p>
                </div>
              </div>
              
              {/* Market Explanation */}
              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="mr-2">💡</span> Understanding {selectedMarket.symbol} in Compound
                </h3>
                <p className="text-sm text-gray-700">
                  {selectedMarket.symbol === 'DAI' && 
                    'DAI is a decentralized stablecoin pegged to the US Dollar. In Compound, DAI typically offers higher supply APY compared to centralized stablecoins due to its popularity in DeFi lending.'}
                  {selectedMarket.symbol === 'USDC' && 
                    'USDC is a centralized stablecoin backed by US Dollars held in reserve. It\'s considered lower risk than algorithmic stablecoins, which is reflected in its lower APY on Compound.'}
                  {selectedMarket.symbol === 'ETH' && 
                    'ETH is the native cryptocurrency of Ethereum. When supplied to Compound, it\'s wrapped as cETH. ETH typically has lower APY but is commonly used as collateral for borrowing stablecoins.'}
                  {selectedMarket.symbol === 'WBTC' && 
                    'WBTC (Wrapped Bitcoin) brings Bitcoin to Ethereum as an ERC-20 token. It typically has lower supply APY but is valuable as collateral due to its market cap and perceived stability.'}
                  {!['DAI', 'USDC', 'ETH', 'WBTC'].includes(selectedMarket.symbol) && 
                    `${selectedMarket.symbol} is available on Compound for lending and borrowing. The interest rates are determined algorithmically based on supply and demand in the market.`}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarketData;
