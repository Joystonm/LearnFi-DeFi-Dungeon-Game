import React, { createContext, useContext, useState, useEffect } from 'react';
import { memoryService } from '../services/memoryService';

// Create context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // User state with default values
  const [user, setUser] = useState({
    username: 'User',
    level: 1,
    experience: 0,
    badges: [],
    completedTopics: [],
    simulationHistory: [],
    balance: {
      DAI: 100,
      ETH: 0.1,
      USDC: 100,
      WBTC: 0.005
    }
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = memoryService.getUserData();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // If there's an error, we'll use the default state
    }
  }, []);

  // Save user data whenever it changes
  useEffect(() => {
    try {
      memoryService.saveUserData(user);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [user]);

  // Add experience points and handle level ups
  const addExperience = (points) => {
    setUser(prevUser => {
      const newExperience = prevUser.experience + points;
      const experienceThreshold = prevUser.level * 100; // Simple level up formula
      
      if (newExperience >= experienceThreshold) {
        // Level up!
        return {
          ...prevUser,
          level: prevUser.level + 1,
          experience: newExperience - experienceThreshold
        };
      }
      
      return {
        ...prevUser,
        experience: newExperience
      };
    });
  };

  // Add a badge to the user's collection
  const addBadge = (badge) => {
    setUser(prevUser => {
      // Check if badge already exists
      if (prevUser.badges.some(b => b.id === badge.id)) {
        return prevUser;
      }
      
      return {
        ...prevUser,
        badges: [...prevUser.badges, badge]
      };
    });
  };

  // Mark a topic as completed
  const completeLearnTopic = (topicId) => {
    setUser(prevUser => {
      if (prevUser.completedTopics.includes(topicId)) {
        return prevUser;
      }
      
      return {
        ...prevUser,
        completedTopics: [...prevUser.completedTopics, topicId],
      };
    });
    
    // Add experience for completing a topic
    addExperience(50);
  };

  // Record a simulation action
  const recordSimulation = (action) => {
    setUser(prevUser => ({
      ...prevUser,
      simulationHistory: [...prevUser.simulationHistory, {
        ...action,
        timestamp: new Date().toISOString()
      }]
    }));
    
    // Add experience for performing a simulation
    addExperience(25);
  };

  // Update token balance
  const updateBalance = (token, amount) => {
    setUser(prevUser => ({
      ...prevUser,
      balance: {
        ...prevUser.balance,
        [token]: Math.max(0, (prevUser.balance[token] || 0) + amount)
      }
    }));
  };

  // Update user data (for game engine)
  const updateUser = (updates) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updates
    }));
  };

  // Calculate user progress percentage
  const calculateProgress = () => {
    // This is a simplified calculation
    const totalTopics = 10; // Assuming there are 10 topics total
    const completedPercentage = (user.completedTopics.length / totalTopics) * 100;
    return Math.min(completedPercentage, 100);
  };

  // Value to be provided by the context
  const value = {
    user,
    setUser,
    updateUser,
    addExperience,
    addBadge,
    completeLearnTopic,
    recordSimulation,
    updateBalance,
    calculateProgress
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Export the context itself for direct use
export { UserContext };
