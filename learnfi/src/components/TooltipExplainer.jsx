import React, { useState } from 'react';

const TooltipExplainer = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {isVisible && (
        <div className="absolute z-10 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-sm text-gray-700 left-1/2 transform -translate-x-1/2 mt-2">
          {content}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default TooltipExplainer;
