// Mock implementation of Compound.js service
// This avoids using the actual Compound.js library which requires Node.js modules

// Mock market data
const mockMarkets = [
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    cTokenSymbol: 'cDAI',
    supplyApy: 2.53,
    borrowApy: 3.82,
    price: 1.00,
    totalSupply: 1234567890,
    totalBorrow: 987654321,
    collateralFactor: 0.75,
    exchangeRate: 0.02,
    underlyingDecimals: 18
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    cTokenSymbol: 'cUSDC',
    supplyApy: 2.12,
    borrowApy: 3.45,
    price: 1.00,
    totalSupply: 2345678901,
    totalBorrow: 1876543210,
    collateralFactor: 0.80,
    exchangeRate: 0.022,
    underlyingDecimals: 6
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    cTokenSymbol: 'cETH',
    supplyApy: 0.32,
    borrowApy: 1.25,
    price: 3500.00,
    totalSupply: 123456,
    totalBorrow: 98765,
    collateralFactor: 0.70,
    exchangeRate: 0.05,
    underlyingDecimals: 18
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    cTokenSymbol: 'cWBTC',
    supplyApy: 0.21,
    borrowApy: 1.12,
    price: 60000.00,
    totalSupply: 5432,
    totalBorrow: 3210,
    collateralFactor: 0.65,
    exchangeRate: 0.02,
    underlyingDecimals: 8
  }
];

// Get all markets data
const getMarkets = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMarkets;
};

// Get specific market data
const getMarket = async (symbol) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMarkets.find(market => market.symbol === symbol);
};

// Calculate supply APY for a token
const calculateSupplyApy = async (symbol) => {
  const market = await getMarket(symbol);
  return market ? market.supplyApy : 0;
};

// Calculate borrow APY for a token
const calculateBorrowApy = async (symbol) => {
  const market = await getMarket(symbol);
  return market ? market.borrowApy : 0;
};

export const compoundService = {
  getMarkets,
  getMarket,
  calculateSupplyApy,
  calculateBorrowApy
};
