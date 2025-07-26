// Detailed explanations of key calculations in Compound
export const calculationExplanations = {
  ctoken: {
    title: "cToken Exchange Rate Calculations",
    explanation: `
## How cToken Exchange Rate Works

The cToken exchange rate represents how much underlying asset each cToken is worth. This rate increases over time as interest accrues.

### Exchange Rate Formula:
\`\`\`
Exchange Rate = (Underlying Balance + Total Borrow Balance - Reserves) / Total cToken Supply
\`\`\`

### Example:
If there are 100 cDAI tokens in circulation, and the total underlying DAI (including supplied and borrowed) is 102 DAI with 1 DAI in reserves:

\`\`\`
Exchange Rate = (102 - 1) / 100 = 1.01 DAI per cDAI
\`\`\`

### Supplying Assets:
When you supply assets, you receive cTokens based on the current exchange rate:

\`\`\`
cTokens Received = Amount Supplied / Current Exchange Rate
\`\`\`

For example, if you supply 100 DAI when the exchange rate is 0.02 DAI per cDAI:
\`\`\`
cDAI Received = 100 / 0.02 = 5,000 cDAI
\`\`\`

### Redeeming Assets:
When you redeem cTokens, you receive the underlying asset based on the current exchange rate:

\`\`\`
Assets Received = cTokens Redeemed × Current Exchange Rate
\`\`\`

For example, if you redeem 5,000 cDAI when the exchange rate has increased to 0.021 DAI per cDAI:
\`\`\`
DAI Received = 5,000 × 0.021 = 105 DAI
\`\`\`

This means you've earned 5 DAI in interest (since you originally supplied 100 DAI).
    `,
    formula: "cTokens = Amount Supplied / Exchange Rate"
  },
  apy: {
    title: "APY Calculation in Compound",
    explanation: `
## How APY is Calculated in Compound

Annual Percentage Yield (APY) represents the annualized interest rate with compounding effects.

### Supply APY Formula:
\`\`\`
Supply APY = ((1 + Supply Rate per Block × Blocks per Day)^365 - 1) × 100%
\`\`\`

### Borrow APY Formula:
\`\`\`
Borrow APY = ((1 + Borrow Rate per Block × Blocks per Day)^365 - 1) × 100%
\`\`\`

### Example:
If the supply rate per block is 0.00000005 and there are 6,570 blocks per day:

\`\`\`
Daily Return = 0.00000005 × 6,570 = 0.0003285
Supply APY = ((1 + 0.0003285)^365 - 1) × 100% = 12.7%
\`\`\`

### Calculating Interest Earned:
For an investment of Principal amount with an APY over a period of t years:

\`\`\`
Interest Earned = Principal × ((1 + APY)^t - 1)
\`\`\`

For example, with $1,000 at 5% APY for 1 year:
\`\`\`
Interest Earned = $1,000 × ((1 + 0.05)^1 - 1) = $1,000 × 0.05 = $50
\`\`\`

For partial years (e.g., 30 days):
\`\`\`
Interest Earned = $1,000 × ((1 + 0.05)^(30/365) - 1) ≈ $4.06
\`\`\`
    `,
    formula: "APY = ((1 + Rate per Block × Blocks per Day)^365 - 1) × 100%"
  },
  collateral: {
    title: "Collateral Factor and Borrow Limit Calculations",
    explanation: `
## How Collateral Factor and Borrow Limit Work

The collateral factor determines how much you can borrow against your supplied assets.

### Borrow Limit Formula:
\`\`\`
Borrow Limit = Supplied Value × Collateral Factor
\`\`\`

For multiple assets:
\`\`\`
Total Borrow Limit = Σ(Asset_i Value × Asset_i Collateral Factor)
\`\`\`

### Example:
If you supply:
- 10 ETH worth $3,000 each with a collateral factor of 75%
- 5,000 DAI with a collateral factor of 80%

Your borrow limit would be:
\`\`\`
ETH Borrow Limit = 10 × $3,000 × 0.75 = $22,500
DAI Borrow Limit = 5,000 × $1 × 0.8 = $4,000
Total Borrow Limit = $22,500 + $4,000 = $26,500
\`\`\`

### Borrow Capacity Used:
\`\`\`
Borrow Capacity Used = (Total Borrowed Value / Total Borrow Limit) × 100%
\`\`\`

For example, if you've borrowed $10,000 with a borrow limit of $26,500:
\`\`\`
Borrow Capacity Used = ($10,000 / $26,500) × 100% = 37.7%
\`\`\`

### Remaining Borrow Capacity:
\`\`\`
Remaining Borrow Capacity = Total Borrow Limit - Total Borrowed Value
\`\`\`

In the example above:
\`\`\`
Remaining Borrow Capacity = $26,500 - $10,000 = $16,500
\`\`\`
    `,
    formula: "Borrow Limit = Σ(Asset Value × Collateral Factor)"
  },
  liquidation: {
    title: "Liquidation Risk and Health Factor Calculations",
    explanation: `
## How Liquidation Risk and Health Factor Work

The health factor represents how safe your position is from liquidation.

### Health Factor Formula:
\`\`\`
Health Factor = (Supplied Value × Collateral Factor) / Borrowed Value × 100%
\`\`\`

For multiple supplied assets:
\`\`\`
Health Factor = Σ(Asset_i Value × Asset_i Collateral Factor) / Total Borrowed Value × 100%
\`\`\`

### Example:
If you have:
- Supplied 10 ETH worth $3,000 each with a collateral factor of 75%
- Borrowed $20,000 worth of assets

Your health factor would be:
\`\`\`
Health Factor = (10 × $3,000 × 0.75) / $20,000 × 100% = $22,500 / $20,000 × 100% = 112.5%
\`\`\`

### Liquidation Threshold:
Liquidation occurs when your health factor falls below 100%.

### Liquidation Example:
If ETH price drops from $3,000 to $2,500:
\`\`\`
New Supplied Value = 10 × $2,500 = $25,000
New Health Factor = ($25,000 × 0.75) / $20,000 × 100% = $18,750 / $20,000 × 100% = 93.75%
\`\`\`

Since the health factor is now below 100%, your position is eligible for liquidation.

### Liquidation Process:
During liquidation:
1. A liquidator repays part of your debt (up to a close factor, typically 50%)
2. In return, they receive an equivalent amount of your collateral plus a liquidation incentive (typically 5-15%)
3. This reduces your debt but also reduces your collateral

### Safety Buffer:
To avoid liquidation, it's recommended to maintain a health factor of at least 150-200%.
    `,
    formula: "Health Factor = (Supplied Value × Collateral Factor) / Borrowed Value × 100%"
  },
  interest: {
    title: "Interest Rate Model Calculations",
    explanation: `
## How Interest Rate Models Work

Compound uses algorithmic interest rate models that adjust based on the utilization rate of each asset.

### Utilization Rate Formula:
\`\`\`
Utilization Rate = Total Borrowed / Total Supplied × 100%
\`\`\`

### Interest Rate Model (Simplified):
Compound uses a piecewise interest rate model with two regions:

1. When Utilization Rate ≤ Optimal Utilization (typically 80%):
\`\`\`
Borrow Rate = Base Rate + (Multiplier × Utilization Rate)
\`\`\`

2. When Utilization Rate > Optimal Utilization:
\`\`\`
Borrow Rate = Base Rate + (Multiplier × Optimal Utilization) + (Jump Multiplier × (Utilization Rate - Optimal Utilization))
\`\`\`

### Example:
With parameters:
- Base Rate = 0%
- Multiplier = 5%
- Jump Multiplier = 109%
- Optimal Utilization = 80%

At 50% utilization:
\`\`\`
Borrow Rate = 0% + (5% × 50%) = 2.5%
\`\`\`

At 90% utilization:
\`\`\`
Borrow Rate = 0% + (5% × 80%) + (109% × (90% - 80%)) = 4% + 10.9% = 14.9%
\`\`\`

### Supply Rate Formula:
\`\`\`
Supply Rate = Borrow Rate × Utilization Rate × (1 - Reserve Factor)
\`\`\`

With a reserve factor of 10% and utilization of 50%:
\`\`\`
Supply Rate = 2.5% × 50% × (1 - 0.1) = 2.5% × 50% × 0.9 = 1.125%
\`\`\`

This model ensures that:
1. Interest rates increase as utilization increases
2. There's a sharp increase in rates when utilization exceeds the optimal level
3. Supply rates are always lower than borrow rates
    `,
    formula: "Borrow Rate = Base Rate + (Multiplier × Utilization Rate)"
  },
  governance: {
    title: "Compound Governance Mechanism",
    explanation: `
## How Compound Governance Works

Compound Governance allows COMP token holders to propose and vote on changes to the protocol.

### Proposal Threshold:
To submit a proposal, an address must have at least 1% of the total COMP supply delegated to it.

### Voting Power:
\`\`\`
Voting Power = Number of COMP tokens held or delegated
\`\`\`

### Voting Process:
1. **Proposal Creation**: A user with sufficient COMP creates a proposal
2. **Voting Period**: COMP holders vote "For," "Against," or "Abstain" during a 3-day period
3. **Execution**: If approved, there's a 2-day timelock before execution

### Proposal Success Criteria:
A proposal succeeds if:
1. At least 400,000 COMP votes "For" the proposal
2. More COMP votes "For" than "Against"

### Delegation:
Users can delegate their voting rights to another address without transferring their tokens:
\`\`\`
delegate(address delegatee)
\`\`\`

### COMP Distribution:
COMP tokens are distributed to users based on their activity in the protocol:
\`\`\`
COMP per day per market = Daily COMP distribution × Market Weight
User COMP = (User Activity / Total Activity) × COMP per day per market
\`\`\`

Where "Activity" can be supplying or borrowing, depending on the distribution rules.

### Governance Examples:
Through governance, COMP holders can vote on:
- Adding new assets to the protocol
- Adjusting collateral factors
- Changing interest rate models
- Upgrading the protocol code
- Allocating community funds
    `,
    formula: "Voting Power = Number of COMP tokens held or delegated"
  }
};
