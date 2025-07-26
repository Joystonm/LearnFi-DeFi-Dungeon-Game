// Mock implementation of axios to avoid process/browser dependency issues

// Mock axios instance
const mockAxios = {
  create: (config) => {
    return {
      post: async (url, data) => {
        console.log(`Mock axios POST request to ${url}`, data);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock response based on the URL
        if (url.includes('chat/completions')) {
          return {
            data: {
              choices: [
                {
                  message: {
                    content: "This is a mock response from the Groq API. In a real implementation, this would be an AI-generated explanation of a DeFi concept."
                  }
                }
              ]
            }
          };
        } else if (url.includes('search')) {
          return {
            data: {
              answer: "This is a mock answer from the Tavily API.",
              results: [
                {
                  title: "Mock Article",
                  content: "This is a mock article content.",
                  url: "https://example.com",
                  published_date: "2023-01-01"
                }
              ]
            }
          };
        }
        
        // Default response
        return {
          data: {
            message: "Mock response"
          }
        };
      },
      
      get: async (url) => {
        console.log(`Mock axios GET request to ${url}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Default response
        return {
          data: {
            message: "Mock response"
          }
        };
      }
    };
  }
};

export default mockAxios;
