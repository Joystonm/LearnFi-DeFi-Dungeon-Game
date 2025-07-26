import React from 'react';
import TooltipExplainer from './TooltipExplainer';

const TokenCard = ({ token, balance, apy, action, onClick }) => {
  // Get token icon
  const getTokenIcon = () => {
    switch (token) {
      case 'DAI':
        return '💰';
      case 'USDC':
        return '💵';
      case 'ETH':
        return '💎';
      case 'WBTC':
        return '🔶';
      default:
        return '🪙';
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl mr-3">
            {getTokenIcon()}
          </div>
          <div>
            <h3 className="font-medium">{token}</h3>
            <p className="text-xs text-gray-500">
              {balance} {token}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm font-medium text-green-600 mr-1">{apy}% APY</span>
          <TooltipExplainer content={`This is the current Annual Percentage Yield for ${action === 'supply' ? 'supplying' : 'borrowing'} ${token}.`} />
        </div>
      </div>
      
      <button
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          action === 'supply'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {action === 'supply' ? 'Supply' : 'Borrow'} {token}
      </button>
    </div>
  );
};

export default TokenCard;
