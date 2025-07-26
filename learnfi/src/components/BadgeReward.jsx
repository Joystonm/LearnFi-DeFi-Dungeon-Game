import React from 'react';

const BadgeReward = ({ badge, isNew = false }) => {
  // Determine badge icon based on type
  const getBadgeIcon = () => {
    switch (badge.type) {
      case 'quiz':
        return '🎓';
      case 'simulation':
        return '🏆';
      case 'achievement':
        return '🌟';
      default:
        return '🏅';
    }
  };
  
  return (
    <div className={`relative bg-white rounded-lg p-4 shadow-md ${isNew ? 'ring-2 ring-blue-500' : ''}`}>
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          NEW
        </span>
      )}
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-3">
          {getBadgeIcon()}
        </div>
        
        <h3 className="font-semibold text-center mb-1">{badge.name}</h3>
        <p className="text-xs text-gray-500 text-center">{badge.description}</p>
      </div>
    </div>
  );
};

export default BadgeReward;
