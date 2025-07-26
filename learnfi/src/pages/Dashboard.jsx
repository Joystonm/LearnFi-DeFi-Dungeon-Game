import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCompound } from '../context/CompoundContext';

const Dashboard = () => {
  // Get user data from context
  const { user, calculateProgress } = useUser();
  const { userCompound } = useCompound();
  
  // Calculate user progress
  const progressPercentage = calculateProgress();
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>
      
      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Completion</span>
          <span className="text-sm font-medium text-blue-600">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Level</p>
            <p className="text-xl font-bold">{user.level}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="text-xl font-bold">{user.experience} / {user.level * 100} XP</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Topics Completed</p>
            <p className="text-xl font-bold">{user.completedTopics.length}</p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          <p className="text-gray-600 mb-4">Pick up where you left off or start a new topic.</p>
          <Link 
            to="/learn" 
            className="btn btn-primary block text-center"
          >
            Go to Learning Modules
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Practice with Simulation</h2>
          <p className="text-gray-600 mb-4">Apply what you've learned in our risk-free environment.</p>
          <Link 
            to="/simulate" 
            className="btn btn-primary block text-center"
          >
            Open Simulation
          </Link>
        </div>
      </div>
      
      {/* Compound Position */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Compound Position</h2>
        
        {Object.keys(userCompound.supplied).length > 0 ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Supplied Assets</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(userCompound.supplied).map(([token, amount]) => (
                  <div key={token} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{token}</span>
                      <span>{amount.toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {Object.keys(userCompound.borrowed).length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Borrowed Assets</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(userCompound.borrowed).map(([token, amount]) => (
                    <div key={token} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{token}</span>
                        <span>{amount.toFixed(4)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Health Factor</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    userCompound.health > 50 ? 'bg-green-500' : 
                    userCompound.health > 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${userCompound.health}%` }}
                ></div>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-sm text-gray-500">{userCompound.health.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't supplied any assets yet.</p>
            <Link 
              to="/simulate" 
              className="btn btn-primary"
            >
              Start Simulation
            </Link>
          </div>
        )}
      </div>
      
      {/* Badges */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
        
        {user.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {user.badges.map((badge) => (
              <div key={badge.id} className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">
                  {badge.type === 'quiz' ? '🎓' : '🏆'}
                </div>
                <h3 className="font-medium text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Complete lessons and simulations to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
