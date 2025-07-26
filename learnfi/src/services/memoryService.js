// Memory service for storing user data locally

const USER_DATA_KEY = 'learnfi_user_data';
const COMPLETED_TOPICS_KEY = 'learnfi_completed_topics';
const BADGES_KEY = 'learnfi_badges';
const SIMULATION_HISTORY_KEY = 'learnfi_simulation_history';

// Helper function to safely parse JSON
const safelyParseJSON = (json) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

// Helper function to safely stringify JSON
const safelyStringifyJSON = (data) => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return null;
  }
};

// Helper function to safely access localStorage
const safelyAccessLocalStorage = (operation, key, data = null) => {
  try {
    if (operation === 'get') {
      return localStorage.getItem(key);
    } else if (operation === 'set') {
      localStorage.setItem(key, data);
      return true;
    } else if (operation === 'remove') {
      localStorage.removeItem(key);
      return true;
    }
    return null;
  } catch (e) {
    console.error(`Error accessing localStorage: ${e.message}`);
    return null;
  }
};

// Save user data to localStorage
const saveUserData = (userData) => {
  const jsonData = safelyStringifyJSON(userData);
  if (jsonData) {
    return safelyAccessLocalStorage('set', USER_DATA_KEY, jsonData);
  }
  return false;
};

// Get user data from localStorage
const getUserData = () => {
  const userData = safelyAccessLocalStorage('get', USER_DATA_KEY);
  return safelyParseJSON(userData);
};

// Save completed topics
const saveCompletedTopics = (topics) => {
  const jsonData = safelyStringifyJSON(topics);
  if (jsonData) {
    return safelyAccessLocalStorage('set', COMPLETED_TOPICS_KEY, jsonData);
  }
  return false;
};

// Get completed topics
const getCompletedTopics = () => {
  const topics = safelyAccessLocalStorage('get', COMPLETED_TOPICS_KEY);
  return safelyParseJSON(topics) || [];
};

// Save badges
const saveBadges = (badges) => {
  const jsonData = safelyStringifyJSON(badges);
  if (jsonData) {
    return safelyAccessLocalStorage('set', BADGES_KEY, jsonData);
  }
  return false;
};

// Get badges
const getBadges = () => {
  const badges = safelyAccessLocalStorage('get', BADGES_KEY);
  return safelyParseJSON(badges) || [];
};

// Save simulation history
const saveSimulationHistory = (history) => {
  const jsonData = safelyStringifyJSON(history);
  if (jsonData) {
    return safelyAccessLocalStorage('set', SIMULATION_HISTORY_KEY, jsonData);
  }
  return false;
};

// Get simulation history
const getSimulationHistory = () => {
  const history = safelyAccessLocalStorage('get', SIMULATION_HISTORY_KEY);
  return safelyParseJSON(history) || [];
};

// Clear all user data
const clearAllData = () => {
  try {
    safelyAccessLocalStorage('remove', USER_DATA_KEY);
    safelyAccessLocalStorage('remove', COMPLETED_TOPICS_KEY);
    safelyAccessLocalStorage('remove', BADGES_KEY);
    safelyAccessLocalStorage('remove', SIMULATION_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
};

export const memoryService = {
  saveUserData,
  getUserData,
  saveCompletedTopics,
  getCompletedTopics,
  saveBadges,
  getBadges,
  saveSimulationHistory,
  getSimulationHistory,
  clearAllData
};
