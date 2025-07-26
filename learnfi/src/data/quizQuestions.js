export const quizQuestions = {
  'introduction': {
    question: 'What is the main advantage of DeFi over traditional finance?',
    options: [
      'Higher interest rates guaranteed',
      'Elimination of intermediaries and 24/7 access',
      'Government backing and insurance',
      'Lower risk investments'
    ],
    correctAnswer: 1,
    explanation: 'DeFi eliminates traditional intermediaries like banks and operates 24/7 on blockchain networks, providing global access without geographical restrictions.'
  },
  
  'compound-basics': {
    question: 'What happens when you supply assets to Compound?',
    options: [
      'You lose ownership of your assets permanently',
      'You receive cTokens and start earning interest immediately',
      'You must wait 30 days before earning interest',
      'You can only withdraw during business hours'
    ],
    correctAnswer: 1,
    explanation: 'When you supply assets to Compound, you receive cTokens that represent your deposit plus accrued interest, and you start earning interest immediately.'
  },
  
  'ctokens': {
    question: 'How do cTokens represent your growing balance?',
    options: [
      'The number of cTokens increases over time',
      'The exchange rate between cTokens and underlying assets increases',
      'cTokens pay dividends monthly',
      'You need to manually claim interest'
    ],
    correctAnswer: 1,
    explanation: 'cTokens maintain a constant quantity, but their exchange rate with the underlying asset increases over time as interest accrues, representing your growing balance.'
  },
  
  'borrowing': {
    question: 'What determines how much you can borrow in Compound?',
    options: [
      'Your credit score and income',
      'The collateral value multiplied by the collateral factor',
      'A fixed amount set by Compound',
      'The amount of COMP tokens you hold'
    ],
    correctAnswer: 1,
    explanation: 'Your borrowing capacity is determined by the value of your collateral multiplied by each asset\'s collateral factor. For example, ETH with an 82.5% factor allows you to borrow up to 82.5% of your ETH collateral value.'
  },
  
  'liquidation': {
    question: 'When does liquidation occur in Compound?',
    options: [
      'After 30 days of borrowing',
      'When you miss a payment deadline',
      'When your borrow balance exceeds collateral value × collateral factor',
      'When interest rates change'
    ],
    correctAnswer: 2,
    explanation: 'Liquidation occurs when your borrow balance exceeds the value of your collateral multiplied by the collateral factor, meaning you\'ve borrowed too much relative to your collateral.'
  },
  
  'interest-rates': {
    question: 'How are interest rates determined in Compound?',
    options: [
      'Set by a central committee',
      'Fixed rates that never change',
      'Algorithmically based on supply and demand (utilization rate)',
      'Randomly generated each day'
    ],
    correctAnswer: 2,
    explanation: 'Compound uses algorithmic interest rate models that adjust rates based on the utilization rate (total borrows ÷ total supply). Higher utilization leads to higher rates for both suppliers and borrowers.'
  },
  
  'governance': {
    question: 'How do COMP token holders participate in governance?',
    options: [
      'By sending emails to the Compound team',
      'Through voting on proposals with voting power proportional to token holdings',
      'By completing surveys on social media',
      'Only large holders can participate'
    ],
    correctAnswer: 1,
    explanation: 'COMP token holders can vote on governance proposals, with voting power proportional to their token holdings. Proposals require significant token support to pass and implement changes to the protocol.'
  }
};
