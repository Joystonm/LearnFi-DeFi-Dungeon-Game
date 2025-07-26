import React, { useState, useRef, useEffect } from 'react';

const InteractiveTooltip = ({ 
  children, 
  content, 
  position = 'top',
  interactive = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // Handle click outside to close interactive tooltips
  useEffect(() => {
    if (!interactive || !isVisible) return;

    const handleClickOutside = (event) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [interactive, isVisible]);

  // Position classes based on the position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  // Arrow position classes
  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45';
      case 'bottom':
        return 'top-[-6px] left-1/2 transform -translate-x-1/2 rotate-45';
      case 'left':
        return 'right-[-6px] top-1/2 transform -translate-y-1/2 rotate-45';
      case 'right':
        return 'left-[-6px] top-1/2 transform -translate-y-1/2 rotate-45';
      default:
        return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        className="inline-block cursor-help"
        onMouseEnter={() => !interactive && setIsVisible(true)}
        onMouseLeave={() => !interactive && setIsVisible(false)}
        onClick={() => interactive && setIsVisible(!isVisible)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-sm ${getPositionClasses()}`}
        >
          <div className={`absolute w-3 h-3 bg-white border border-gray-200 ${getArrowClasses()}`}></div>
          <div className="relative z-10">
            {typeof content === 'function' ? content() : content}
            
            {interactive && (
              <div className="mt-2 pt-2 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Got it
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTooltip;
