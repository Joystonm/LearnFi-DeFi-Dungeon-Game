// API Keys and Configuration
const config = {
  // API Keys
  groqApiKey: process.env.REACT_APP_GROQ_API_KEY || '',
  tavilyApiKey: process.env.REACT_APP_TAVILY_API_KEY || '',
  
  // API Base URLs
  groqApiUrl: 'https://api.groq.com/v1',
  tavilyApiUrl: 'https://api.tavily.com/v1',
  
  // Compound Configuration
  compoundNetwork: process.env.REACT_APP_COMPOUND_NETWORK || 'mainnet',
  
  // Environment
  isDevelopment: process.env.REACT_APP_ENV === 'development',
};

export default config;
