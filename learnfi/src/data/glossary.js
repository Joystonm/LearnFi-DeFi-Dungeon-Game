// Glossary of DeFi terms and concepts related to Compound
export const glossary = [
  {
    term: "cToken",
    explanation: "cTokens are tokens that represent your funds deposited in Compound. When you supply an asset to Compound, you receive cTokens in return. For example, supplying DAI gives you cDAI. These tokens automatically earn interest through their exchange rate, which increases over time relative to the underlying asset."
  },
  {
    term: "APY",
    explanation: "Annual Percentage Yield (APY) represents the rate of return earned on an investment over a year, taking into account the effect of compounding interest. In Compound, the APY for supplying or borrowing assets fluctuates based on market supply and demand for each asset."
  },
  {
    term: "Collateral Factor",
    explanation: "The Collateral Factor determines how much you can borrow against your supplied assets in Compound. For example, if DAI has a collateral factor of 75%, you can borrow up to 75% of the value of your supplied DAI. This helps maintain the protocol's solvency by ensuring loans are over-collateralized."
  },
  {
    term: "Liquidation",
    explanation: "Liquidation occurs when the value of your borrowed assets exceeds your allowed borrowing limit. When this happens, a portion of your collateral is sold at a discount to repay your loan. To avoid liquidation, you should maintain a safe buffer between your borrowed amount and your borrowing limit."
  },
  {
    term: "Utilization Rate",
    explanation: "The Utilization Rate is the percentage of a market's total supplied assets that are currently being borrowed. This rate directly influences interest rates in Compound - as utilization increases, supply interest rates increase to incentivize more deposits, and borrowing rates increase to discourage additional borrowing."
  },
  {
    term: "Governance",
    explanation: "Compound Governance refers to the system where COMP token holders can propose and vote on changes to the protocol. This includes adjusting interest rate models, adding new assets, or changing collateral factors. This decentralized governance model gives the community control over the protocol's evolution."
  },
  {
    term: "Interest Rate Model",
    explanation: "Compound uses algorithmic interest rate models that adjust based on the utilization rate of each asset. When more of an asset is borrowed relative to the total supply, interest rates increase. This dynamic model helps balance supply and demand within the protocol."
  },
  {
    term: "Health Factor",
    explanation: "The Health Factor represents the safety of your position in Compound. It's calculated by dividing your collateral value (adjusted by collateral factors) by your borrowed value. A health factor above 1 means your position is safe, while below 1 means you're at risk of liquidation."
  },
  {
    term: "Flash Loan",
    explanation: "A Flash Loan is a type of uncollateralized loan where you borrow assets that must be returned within the same transaction block. If the loan isn't repaid in the same transaction, the entire transaction reverts. These are often used for arbitrage, collateral swaps, or liquidations in DeFi."
  },
  {
    term: "Liquidity Mining",
    explanation: "Liquidity Mining is a process where users provide liquidity (supply assets) to a protocol and receive token rewards in return. Compound introduced this concept by distributing COMP tokens to users who supply or borrow assets, incentivizing participation in the protocol."
  },
  {
    term: "Oracle",
    explanation: "Oracles provide external data to blockchain applications. Compound uses price oracles to determine the current market value of assets, which is crucial for calculating collateral values, borrowing limits, and determining when liquidations should occur."
  },
  {
    term: "Gas",
    explanation: "Gas refers to the computational effort required to execute operations on the Ethereum network. Each transaction on Compound requires gas, paid in ETH. During periods of network congestion, gas prices can increase significantly, making transactions more expensive."
  },
  {
    term: "Total Value Locked (TVL)",
    explanation: "Total Value Locked represents the total value of assets deposited in a DeFi protocol. For Compound, this includes all assets supplied to the protocol. TVL is an important metric for measuring the size and adoption of DeFi protocols."
  },
  {
    term: "Yield Farming",
    explanation: "Yield Farming involves moving assets between different DeFi protocols to maximize returns. In the context of Compound, users might supply assets to earn interest and COMP tokens, then use their cTokens in other protocols to earn additional yields."
  },
  {
    term: "Overcollateralization",
    explanation: "Overcollateralization means that the value of collateral exceeds the value of the borrowed assets. Compound requires overcollateralization to ensure the protocol remains solvent even during market volatility. This is why you can typically only borrow up to 60-80% of your collateral's value."
  }
];
