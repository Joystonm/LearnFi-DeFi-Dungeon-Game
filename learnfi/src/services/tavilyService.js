// Static trivia service (replaces AI-powered trivia)

// Static trivia facts about DeFi and Compound
const triviaFacts = [
  {
    fact: "Compound was one of the first DeFi protocols to introduce the concept of 'governance tokens' with COMP, allowing token holders to vote on protocol changes.",
    source: "DeFi Education"
  },
  {
    fact: "The Compound protocol automatically adjusts interest rates based on supply and demand, creating a dynamic market for lending and borrowing.",
    source: "DeFi Education"
  },
  {
    fact: "cTokens represent your share of the lending pool and accrue interest through an increasing exchange rate with the underlying asset.",
    source: "DeFi Education"
  },
  {
    fact: "Liquidation in Compound occurs when a borrower's health factor falls below 1.0, protecting the protocol from bad debt.",
    source: "DeFi Education"
  },
  {
    fact: "The total value locked (TVL) in Compound has exceeded $10 billion at its peak, making it one of the largest DeFi protocols.",
    source: "DeFi Education"
  },
  {
    fact: "Compound's interest rate model uses a utilization curve that increases rates exponentially as utilization approaches 100%.",
    source: "DeFi Education"
  },
  {
    fact: "The Compound protocol is fully decentralized and runs on smart contracts, meaning no single entity controls user funds.",
    source: "DeFi Education"
  },
  {
    fact: "COMP tokens are distributed to users who supply or borrow assets, incentivizing participation in the protocol.",
    source: "DeFi Education"
  },
  {
    fact: "Each asset in Compound has a different collateral factor, with more volatile assets having lower factors to manage risk.",
    source: "DeFi Education"
  },
  {
    fact: "Compound's liquidation mechanism includes a liquidation incentive, typically 5-8%, to encourage liquidators to maintain system health.",
    source: "DeFi Education"
  }
];

// Get a random trivia fact
const getTrivia = async () => {
  // Simulate async behavior
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    // Return a random trivia fact
    const randomIndex = Math.floor(Math.random() * triviaFacts.length);
    return triviaFacts[randomIndex];
  } catch (error) {
    console.error('Error getting trivia:', error);
    return getFallbackTrivia();
  }
};

// Fallback trivia when something goes wrong
const getFallbackTrivia = () => {
  return {
    fact: "Compound is a decentralized lending protocol that allows users to earn interest on their crypto assets or borrow against them.",
    source: "DeFi Education"
  };
};

export const tavilyService = {
  getTrivia
};
