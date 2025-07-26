// Static educational content service (replaces AI-powered explanations)
import { quizQuestions } from '../data/quizQuestions';

// Static explanations for different DeFi concepts
const staticExplanations = {
  'Supply Assets': {
    explanation: 'Supplying assets to Compound means depositing your tokens into the protocol to earn interest. When you supply assets, you receive cTokens in return, which represent your share of the lending pool. These cTokens automatically accrue interest over time through an increasing exchange rate with the underlying asset.',
    difficulty: 'intermediate',
    source: 'educational_content'
  },
  'Borrow Assets': {
    explanation: 'Borrowing from Compound allows you to take out loans against your supplied collateral. You must maintain a healthy collateral ratio to avoid liquidation. Interest accrues on borrowed amounts and must be repaid. The amount you can borrow depends on the collateral factor of your supplied assets.',
    difficulty: 'intermediate',
    source: 'educational_content'
  },
  'cTokens': {
    explanation: 'cTokens are ERC-20 tokens that represent your balance in a Compound money market. They accrue interest through an increasing exchange rate with the underlying asset. For example, if you supply 100 DAI, you might receive 5000 cDAI. Over time, those 5000 cDAI might be redeemable for 105 DAI due to earned interest.',
    difficulty: 'intermediate',
    source: 'educational_content'
  },
  'Interest Rates': {
    explanation: 'Interest rates in Compound are determined algorithmically based on supply and demand. When utilization is high (more borrowing), rates increase to incentivize more supply. When utilization is low, rates decrease. This creates a natural balance between lenders and borrowers.',
    difficulty: 'intermediate',
    source: 'educational_content'
  },
  'Liquidation': {
    explanation: 'Liquidation occurs when a borrower\'s collateral value falls below the required threshold (health factor < 1.0). Liquidators can repay part of the debt and receive collateral at a discount (liquidation incentive). This mechanism protects the protocol from bad debt and maintains system solvency.',
    difficulty: 'intermediate',
    source: 'educational_content'
  },
  'Collateral Factor': {
    explanation: 'The collateral factor determines how much you can borrow against your supplied assets. For example, if ETH has a 75% collateral factor, you can borrow up to $750 for every $1000 of ETH you supply. Different assets have different collateral factors based on their risk profiles.',
    difficulty: 'intermediate',
    source: 'educational_content'
  },
  'Health Factor': {
    explanation: 'Your health factor measures the safety of your borrowing position. It\'s calculated as (Collateral Value × Collateral Factor) / Borrowed Value. A health factor above 1.0 means you\'re safe from liquidation. Below 1.0 means you can be liquidated. Most users try to keep it above 1.5 for safety.',
    difficulty: 'intermediate',
    source: 'educational_content'
  }
};

// Get explanation for a concept
const getExplanation = async (concept, difficulty = 'intermediate') => {
  // Simulate async behavior
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const explanation = staticExplanations[concept];
  if (explanation) {
    return {
      explanation: explanation.explanation,
      difficulty: difficulty,
      source: explanation.source
    };
  }
  
  // Fallback explanation
  return {
    explanation: `${concept} is an important concept in DeFi and the Compound Protocol. It helps users understand how decentralized finance works and enables them to make informed decisions about lending and borrowing.`,
    difficulty: difficulty,
    source: 'fallback_content'
  };
};

// Get quiz question for a topic
const getQuizQuestion = async (topic, topicId) => {
  // Simulate async behavior
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Use existing quiz questions or create static ones
  const existingQuiz = quizQuestions.find(q => q.id === topicId);
  if (existingQuiz) {
    return existingQuiz;
  }
  
  // Static quiz questions for different topics
  const staticQuizzes = {
    'supply': {
      question: 'What happens when you supply assets to Compound?',
      options: [
        'You receive cTokens that accrue interest',
        'You immediately get cash back',
        'Your tokens are permanently locked',
        'You become a protocol owner'
      ],
      correctAnswer: 0,
      explanation: 'When you supply assets to Compound, you receive cTokens in return. These cTokens represent your share of the lending pool and automatically accrue interest over time.'
    },
    'borrow': {
      question: 'What is required to borrow assets from Compound?',
      options: [
        'A credit score check',
        'Collateral that exceeds the borrow amount',
        'Permission from other users',
        'A minimum account age'
      ],
      correctAnswer: 1,
      explanation: 'To borrow from Compound, you must supply collateral that exceeds the value of what you want to borrow. This over-collateralization protects the protocol.'
    },
    'ctokens': {
      question: 'How do cTokens accrue interest?',
      options: [
        'Through daily airdrops',
        'By increasing in quantity',
        'Through an increasing exchange rate',
        'By staking rewards'
      ],
      correctAnswer: 2,
      explanation: 'cTokens accrue interest through an increasing exchange rate with the underlying asset. The number of cTokens stays the same, but each becomes worth more.'
    },
    'interest': {
      question: 'How are interest rates determined in Compound?',
      options: [
        'Set by the team manually',
        'Voted on by users',
        'Determined algorithmically by supply and demand',
        'Fixed at protocol launch'
      ],
      correctAnswer: 2,
      explanation: 'Interest rates in Compound are determined algorithmically based on the utilization rate (supply vs demand) of each asset.'
    },
    'liquidation': {
      question: 'When does liquidation occur?',
      options: [
        'When you want to withdraw',
        'When health factor falls below 1.0',
        'After 30 days of borrowing',
        'When interest rates change'
      ],
      correctAnswer: 1,
      explanation: 'Liquidation occurs when your health factor falls below 1.0, meaning your collateral is insufficient to cover your debt.'
    }
  };
  
  return staticQuizzes[topicId] || {
    question: `Which statement about ${topic} is correct?`,
    options: [
      'It is a core DeFi concept',
      'It only works with Bitcoin',
      'It requires government approval',
      'It is not used in Compound'
    ],
    correctAnswer: 0,
    explanation: `${topic} is indeed a core concept in DeFi and is fundamental to understanding how protocols like Compound work.`
  };
};

// Export the service with static content
export const groqService = {
  getExplanation,
  getQuizQuestion
};
