// Game States
export const GAME_STATES = {
  EXPLORING: 'exploring',
  BATTLE: 'battle',
  PUZZLE: 'puzzle',
  SHOP: 'shop',
  INVENTORY: 'inventory',
  PAUSED: 'paused'
};

// Token Data (based on real Compound tokens)
export const TOKENS = {
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    color: '#627EEA',
    baseAPY: 2.5,
    collateralFactor: 0.75,
    volatility: 'high'
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '💵',
    color: '#2775CA',
    baseAPY: 4.2,
    collateralFactor: 0.85,
    volatility: 'low'
  },
  DAI: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    icon: '🟡',
    color: '#F5AC37',
    baseAPY: 3.8,
    collateralFactor: 0.80,
    volatility: 'low'
  },
  WBTC: {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    icon: '₿',
    color: '#F7931A',
    baseAPY: 1.8,
    collateralFactor: 0.70,
    volatility: 'high'
  }
};

// Dungeon Rooms - Each teaches a DeFi concept
export const DUNGEON_ROOMS = {
  0: {
    id: 0,
    name: "The Entrance Hall",
    type: 'tutorial',
    concept: 'DeFi Basics',
    description: "Welcome to the DeFi Dungeon! Learn the basics of decentralized finance.",
    enemy: null,
    challenge: {
      type: 'introduction',
      question: "What does DeFi stand for?",
      options: [
        "Decentralized Finance",
        "Digital Finance", 
        "Distributed Finance",
        "Deferred Finance"
      ],
      correct: 0,
      explanation: "DeFi stands for Decentralized Finance - financial services built on blockchain without traditional intermediaries."
    },
    rewards: { xp: 50, tokens: 100, badge: { name: 'DeFi Novice', roomId: 0 } },
    unlocks: [1, 2]
  },
  
  1: {
    id: 1,
    name: "The Lending Library",
    type: 'puzzle',
    concept: 'Lending & Borrowing',
    description: "Master the art of lending your assets to earn interest.",
    enemy: null,
    challenge: {
      type: 'supply_tokens',
      instruction: "Supply 500 USDC to start earning interest. What's your expected annual return?",
      requiredAction: { type: 'supply', token: 'USDC', amount: 500 },
      calculation: "APY calculation",
      explanation: "When you supply tokens to Compound, you earn interest from borrowers. Your tokens become cTokens representing your share."
    },
    rewards: { xp: 100, tokens: 50, badge: { name: 'Lender', roomId: 1 } },
    unlocks: [3, 4]
  },

  2: {
    id: 2,
    name: "The Collateral Vault",
    type: 'puzzle',
    concept: 'Collateral & cTokens',
    description: "Understand how your supplied assets become collateral.",
    enemy: null,
    challenge: {
      type: 'collateral_management',
      instruction: "Supply ETH as collateral. How much can you borrow against it?",
      requiredAction: { type: 'supply', token: 'ETH', amount: 1 },
      calculation: "Collateral factor calculation",
      explanation: "Collateral factor determines how much you can borrow. ETH has a 75% collateral factor."
    },
    rewards: { xp: 100, tokens: 75, badge: { name: 'Collateral Master', roomId: 2 } },
    unlocks: [5]
  },

  3: {
    id: 3,
    name: "The Borrower's Den",
    type: 'battle',
    concept: 'Borrowing Mechanics',
    description: "Face the Interest Rate Monster! Borrow wisely or face liquidation.",
    enemy: {
      name: "Interest Rate Beast",
      health: 200,
      weakness: "Low utilization rates",
      attacks: ["Rate Spike", "Utilization Surge", "APY Blast"]
    },
    challenge: {
      type: 'borrowing_strategy',
      instruction: "Borrow USDC against your ETH collateral. Keep your health factor above 1.3!",
      requiredAction: { type: 'borrow', token: 'USDC', maxAmount: 750 },
      winCondition: "Maintain health factor > 1.3",
      explanation: "Borrowing increases your debt. Monitor your health factor to avoid liquidation!"
    },
    rewards: { xp: 150, tokens: 100, badge: { name: 'Smart Borrower', roomId: 3 } },
    unlocks: [6, 7]
  },

  4: {
    id: 4,
    name: "The APY Observatory",
    type: 'puzzle',
    concept: 'Interest Rates & APY',
    description: "Decode the mysteries of Annual Percentage Yield.",
    enemy: null,
    challenge: {
      type: 'apy_calculation',
      instruction: "Calculate the difference between supply and borrow APY for optimal strategy.",
      scenario: {
        supplyAPY: 4.2,
        borrowAPY: 6.8,
        amount: 1000
      },
      calculation: "Net APY calculation",
      explanation: "The spread between borrow and supply rates determines profitability of leveraged positions."
    },
    rewards: { xp: 120, tokens: 80, badge: { name: 'Rate Calculator', roomId: 4 } },
    unlocks: [8]
  },

  5: {
    id: 5,
    name: "The Health Factor Sanctuary",
    type: 'battle',
    concept: 'Health Factor & Risk',
    description: "Battle the Liquidation Dragon! Manage your health factor or perish.",
    enemy: {
      name: "Liquidation Dragon",
      health: 300,
      weakness: "High health factors",
      attacks: ["Price Crash", "Liquidation Strike", "Collateral Burn"]
    },
    challenge: {
      type: 'health_management',
      instruction: "Your health factor is dropping! Repay debt or add collateral to survive.",
      scenario: {
        currentHealth: 1.1,
        targetHealth: 1.5,
        options: ['repay', 'supply_more', 'liquidate_position']
      },
      winCondition: "Health factor > 1.5",
      explanation: "Health factor = (Collateral × Collateral Factor) / Borrowed Amount. Below 1.0 = liquidation!"
    },
    rewards: { xp: 200, tokens: 150, badge: { name: 'Risk Manager', roomId: 5 } },
    unlocks: [9]
  },

  6: {
    id: 6,
    name: "The Liquidation Graveyard",
    type: 'battle',
    concept: 'Liquidation Mechanics',
    description: "Witness the aftermath of poor risk management. Learn from others' mistakes.",
    enemy: {
      name: "Liquidation Bot",
      health: 250,
      weakness: "Healthy positions",
      attacks: ["Liquidation Call", "Penalty Strike", "Asset Seizure"]
    },
    challenge: {
      type: 'liquidation_scenario',
      instruction: "A position is being liquidated! Understand the process and penalties.",
      scenario: {
        liquidationPenalty: 0.08, // 8%
        collateralSeized: 1000,
        debtRepaid: 800
      },
      explanation: "Liquidators repay debt and receive collateral + penalty. The borrower loses their collateral."
    },
    rewards: { xp: 180, tokens: 120, badge: { name: 'Liquidation Survivor', roomId: 6 } },
    unlocks: [10]
  },

  7: {
    id: 7,
    name: "The Volatility Storm",
    type: 'battle',
    concept: 'Market Volatility',
    description: "Navigate through extreme market conditions. Adapt your strategy!",
    enemy: {
      name: "Volatility Demon",
      health: 400,
      weakness: "Stable strategies",
      attacks: ["Price Swing", "Flash Crash", "Pump & Dump"]
    },
    challenge: {
      type: 'market_scenario',
      instruction: "ETH price dropped 30%! Adjust your position to avoid liquidation.",
      scenario: {
        priceChange: -0.30,
        timeLimit: 60, // seconds
        actions: ['supply_more', 'repay_debt', 'switch_collateral']
      },
      explanation: "Market volatility affects collateral value. Monitor positions during high volatility periods."
    },
    rewards: { xp: 250, tokens: 200, badge: { name: 'Market Survivor', roomId: 7 } },
    unlocks: [11]
  },

  8: {
    id: 8,
    name: "The Compound Governance Chamber",
    type: 'puzzle',
    concept: 'Governance & COMP',
    description: "Learn about protocol governance and COMP token rewards.",
    enemy: null,
    challenge: {
      type: 'governance_quiz',
      instruction: "Understand how Compound governance works and COMP distribution.",
      questions: [
        {
          question: "What is the COMP token used for?",
          options: ["Governance voting", "Fee payment", "Staking rewards", "All of the above"],
          correct: 0
        }
      ],
      explanation: "COMP tokens are distributed to users and allow voting on protocol changes."
    },
    rewards: { xp: 150, tokens: 100, badge: { name: 'Governor', roomId: 8 } },
    unlocks: [12]
  },

  9: {
    id: 9,
    name: "The Flash Loan Laboratory",
    type: 'battle',
    concept: 'Advanced DeFi Strategies',
    description: "Master advanced DeFi concepts like flash loans and arbitrage.",
    enemy: {
      name: "Arbitrage Phantom",
      health: 350,
      weakness: "Perfect execution",
      attacks: ["MEV Attack", "Front-run Strike", "Slippage Bomb"]
    },
    challenge: {
      type: 'advanced_strategy',
      instruction: "Execute a flash loan arbitrage opportunity across different protocols.",
      scenario: {
        opportunity: "USDC price difference between Compound and Aave",
        profit: 0.02, // 2%
        gasLimit: 500000
      },
      explanation: "Flash loans allow borrowing without collateral if repaid in the same transaction."
    },
    rewards: { xp: 300, tokens: 250, badge: { name: 'DeFi Wizard', roomId: 9 } },
    unlocks: [10]
  },

  11: {
    id: 11,
    name: "The Treasure Vault",
    type: 'treasure',
    concept: 'Bonus Rewards',
    description: "A hidden treasure room filled with rewards and power-ups!",
    enemy: null,
    challenge: {
      type: 'treasure_hunt',
      instruction: "Choose your treasure wisely! Each chest contains different rewards.",
      chests: [
        { id: 1, reward: { tokens: 500, powerUp: 'INTEREST_BOOST' }, rarity: 'common' },
        { id: 2, reward: { tokens: 300, xp: 200, badge: { name: 'Treasure Hunter', roomId: 11 } }, rarity: 'uncommon' },
        { id: 3, reward: { tokens: 1000, powerUp: 'COMPOUND_MULTIPLIER' }, rarity: 'rare' },
        { id: 4, reward: { tokens: 200, powerUp: 'HEALTH_POTION', quantity: 3 }, rarity: 'common' },
        { id: 5, reward: { tokens: 1500, powerUp: 'MARKET_INSIGHT', xp: 300 }, rarity: 'legendary' }
      ],
      explanation: "Treasure rooms provide bonus rewards to help you on your DeFi journey. Choose wisely!"
    },
    rewards: { xp: 100, tokens: 200 },
    unlocks: []
  },

  12: {
    id: 12,
    name: "The Trading Arena",
    type: 'trading',
    concept: 'Advanced Trading',
    description: "Test your trading skills in this high-stakes arena!",
    enemy: {
      name: "Market Maker Bot",
      health: 300,
      weakness: "Perfect timing",
      attacks: ["Price Manipulation", "Spread Widening", "Liquidity Drain"]
    },
    challenge: {
      type: 'trading_challenge',
      instruction: "Make profitable trades while managing your portfolio risk!",
      scenario: {
        startingTokens: 1000,
        timeLimit: 120, // 2 minutes
        priceVolatility: 0.15,
        targetProfit: 200
      },
      winCondition: "Achieve 20% profit while maintaining health factor > 1.2",
      explanation: "Trading requires timing, risk management, and understanding market dynamics."
    },
    rewards: { xp: 400, tokens: 600, badge: { name: 'Master Trader', roomId: 12 } },
    unlocks: []
  },

  13: {
    id: 13,
    name: "The Time Chamber",
    type: 'time_challenge',
    concept: 'Speed & Efficiency',
    description: "Race against time to complete DeFi challenges!",
    enemy: {
      name: "Chronos Guardian",
      health: 250,
      weakness: "Quick decisions",
      attacks: ["Time Freeze", "Deadline Pressure", "Haste Curse"]
    },
    challenge: {
      type: 'timed_multi_challenge',
      instruction: "Complete 5 DeFi tasks in 3 minutes!",
      tasks: [
        { type: 'supply', token: 'USDC', amount: 500, timeLimit: 30 },
        { type: 'calculate_apy', scenario: { rate: 4.5, amount: 1000 }, timeLimit: 20 },
        { type: 'borrow', token: 'DAI', maxAmount: 300, timeLimit: 25 },
        { type: 'health_check', targetHealth: 1.8, timeLimit: 15 },
        { type: 'repay', percentage: 50, timeLimit: 20 }
      ],
      explanation: "In real DeFi, timing is crucial. Quick decisions can mean the difference between profit and loss."
    },
    rewards: { xp: 350, tokens: 500, badge: { name: 'Speed Demon', roomId: 13 } },
    unlocks: []
  },

  14: {
    id: 14,
    name: "The Risk Management Academy",
    type: 'academy',
    concept: 'Advanced Risk Management',
    description: "Master advanced risk management techniques!",
    enemy: null,
    challenge: {
      type: 'risk_simulation',
      instruction: "Navigate through various risk scenarios and make optimal decisions.",
      scenarios: [
        {
          name: "Black Swan Event",
          description: "ETH drops 40% overnight. Your health factor is 1.2. What do you do?",
          options: [
            "Panic sell everything",
            "Add more collateral",
            "Partially repay debt",
            "Do nothing and hope"
          ],
          correct: 2,
          explanation: "Partially repaying debt is the safest option to improve health factor."
        },
        {
          name: "Interest Rate Spike",
          description: "Borrow rates increase from 5% to 12%. You have $1000 borrowed. Action?",
          options: [
            "Repay immediately",
            "Switch to variable rate",
            "Hedge with derivatives",
            "Increase collateral"
          ],
          correct: 0,
          explanation: "High interest rates make borrowing expensive. Repaying reduces cost."
        }
      ],
      explanation: "Risk management is the key to long-term success in DeFi."
    },
    rewards: { xp: 300, tokens: 400, badge: { name: 'Risk Master', roomId: 14 } },
    unlocks: []
  }
};

// Badge System
export const BADGES = {
  'DeFi Novice': {
    name: 'DeFi Novice',
    description: 'Completed the introduction to DeFi',
    icon: '🎓',
    rarity: 'common'
  },
  'Lender': {
    name: 'Lender',
    description: 'Successfully supplied tokens to earn interest',
    icon: '🏦',
    rarity: 'common'
  },
  'Smart Borrower': {
    name: 'Smart Borrower',
    description: 'Borrowed tokens while maintaining healthy collateral',
    icon: '💰',
    rarity: 'uncommon'
  },
  'Risk Manager': {
    name: 'Risk Manager',
    description: 'Mastered health factor management',
    icon: '⚖️',
    rarity: 'rare'
  },
  'DeFi Master': {
    name: 'DeFi Master',
    description: 'Defeated the DeFi Dragon and mastered all concepts',
    icon: '👑',
    rarity: 'legendary'
  }
};

// Power-ups that players can collect and use
export const POWER_UPS = {
  HEALTH_POTION: {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restore 50 health points',
    icon: '🧪',
    effect: { type: 'heal', value: 50 },
    rarity: 'common',
    cost: 100
  },
  INTEREST_BOOST: {
    id: 'interest_boost',
    name: 'Interest Rate Boost',
    description: 'Double APY for next 3 actions',
    icon: '⚡',
    effect: { type: 'apy_boost', multiplier: 2, duration: 3 },
    rarity: 'uncommon',
    cost: 200
  },
  LIQUIDATION_SHIELD: {
    id: 'liquidation_shield',
    name: 'Liquidation Shield',
    description: 'Prevents liquidation for 5 turns',
    icon: '🛡️',
    effect: { type: 'liquidation_immunity', duration: 5 },
    rarity: 'rare',
    cost: 300
  },
  COMPOUND_MULTIPLIER: {
    id: 'compound_multiplier',
    name: 'Compound Multiplier',
    description: 'Triple compound interest for 2 actions',
    icon: '💎',
    effect: { type: 'compound_boost', multiplier: 3, duration: 2 },
    rarity: 'epic',
    cost: 500
  },
  MARKET_INSIGHT: {
    id: 'market_insight',
    name: 'Market Insight',
    description: 'See future price movements for 3 turns',
    icon: '🔮',
    effect: { type: 'price_prediction', duration: 3 },
    rarity: 'legendary',
    cost: 750
  }
};

// Daily challenges for extra rewards
export const DAILY_CHALLENGES = {
  SUPPLY_MASTER: {
    id: 'supply_master',
    name: 'Supply Master',
    description: 'Supply assets 5 times in different rooms',
    requirement: { type: 'supply_count', target: 5 },
    reward: { xp: 200, tokens: 300, badge: 'Daily Supplier' },
    timeLimit: 24 * 60 * 60 * 1000 // 24 hours
  },
  HEALTH_GUARDIAN: {
    id: 'health_guardian',
    name: 'Health Factor Guardian',
    description: 'Maintain health factor above 2.0 for 10 actions',
    requirement: { type: 'health_maintenance', target: 10, threshold: 2.0 },
    reward: { xp: 300, tokens: 400, powerUp: 'LIQUIDATION_SHIELD' },
    timeLimit: 24 * 60 * 60 * 1000
  },
  PUZZLE_SOLVER: {
    id: 'puzzle_solver',
    name: 'Puzzle Solver',
    description: 'Complete 3 puzzle rooms without mistakes',
    requirement: { type: 'perfect_puzzles', target: 3 },
    reward: { xp: 250, tokens: 350, badge: 'Perfect Mind' },
    timeLimit: 24 * 60 * 60 * 1000
  }
};

// Achievement system
export const ACHIEVEMENTS = {
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first room',
    icon: '👶',
    requirement: { type: 'rooms_completed', target: 1 },
    reward: { xp: 50, tokens: 100 }
  },
  DEFI_SCHOLAR: {
    id: 'defi_scholar',
    name: 'DeFi Scholar',
    description: 'Complete 5 rooms',
    icon: '🎓',
    requirement: { type: 'rooms_completed', target: 5 },
    reward: { xp: 200, tokens: 300, powerUp: 'INTEREST_BOOST' }
  },
  LIQUIDATION_SURVIVOR: {
    id: 'liquidation_survivor',
    name: 'Liquidation Survivor',
    description: 'Survive 10 battles without being liquidated',
    icon: '💪',
    requirement: { type: 'battles_survived', target: 10 },
    reward: { xp: 300, tokens: 500, powerUp: 'LIQUIDATION_SHIELD' }
  },
  COMPOUND_MASTER: {
    id: 'compound_master',
    name: 'Compound Master',
    description: 'Earn 1000 tokens through compound interest',
    icon: '👑',
    requirement: { type: 'compound_earnings', target: 1000 },
    reward: { xp: 500, tokens: 1000, badge: 'Compound King' }
  },
  DUNGEON_CONQUEROR: {
    id: 'dungeon_conqueror',
    name: 'Dungeon Conqueror',
    description: 'Complete all 11 rooms',
    icon: '🏆',
    requirement: { type: 'rooms_completed', target: 11 },
    reward: { xp: 1000, tokens: 2000, badge: 'Dungeon Master', powerUp: 'MARKET_INSIGHT' }
  }
};

// Random events that can occur during gameplay
export const RANDOM_EVENTS = {
  MARKET_PUMP: {
    id: 'market_pump',
    name: 'Market Pump!',
    description: 'Crypto markets are surging! All assets gain 20% value.',
    icon: '📈',
    effect: { type: 'price_change', multiplier: 1.2 },
    probability: 0.1,
    duration: 3
  },
  FLASH_CRASH: {
    id: 'flash_crash',
    name: 'Flash Crash!',
    description: 'Markets crashed! All assets lose 15% value.',
    icon: '📉',
    effect: { type: 'price_change', multiplier: 0.85 },
    probability: 0.08,
    duration: 2
  },
  INTEREST_SPIKE: {
    id: 'interest_spike',
    name: 'Interest Rate Spike',
    description: 'Central bank news! Borrow rates increase by 2%.',
    icon: '⬆️',
    effect: { type: 'rate_change', change: 0.02, target: 'borrow' },
    probability: 0.12,
    duration: 4
  },
  WHALE_DEPOSIT: {
    id: 'whale_deposit',
    name: 'Whale Deposit',
    description: 'A whale deposited! Supply rates decrease by 1%.',
    icon: '🐋',
    effect: { type: 'rate_change', change: -0.01, target: 'supply' },
    probability: 0.15,
    duration: 3
  },
  TREASURE_FOUND: {
    id: 'treasure_found',
    name: 'Treasure Found!',
    description: 'You found a treasure chest!',
    icon: '💰',
    effect: { type: 'reward', tokens: 200, powerUp: 'random' },
    probability: 0.05,
    duration: 1
  }
};
