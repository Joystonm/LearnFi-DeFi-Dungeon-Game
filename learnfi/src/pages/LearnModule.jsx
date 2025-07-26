import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { calculationExplanations } from '../data/calculationExplanations';

const LearnModule = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  // State for the current topic and explanation
  const [currentTopic, setCurrentTopic] = useState(null);
  const [explanation, setExplanation] = useState({ explanation: '', source: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [showCalculations, setShowCalculations] = useState(false);
  
  // List of available topics
  const topics = [
    { id: 'ctoken', title: 'What is a cToken?', icon: '🪙' },
    { id: 'apy', title: 'Understanding APY', icon: '📈' },
    { id: 'collateral', title: 'Collateral Factor', icon: '🔒' },
    { id: 'liquidation', title: 'Liquidation Risk', icon: '⚠️' },
    { id: 'interest', title: 'Interest Rate Models', icon: '💹' },
    { id: 'governance', title: 'Compound Governance', icon: '🏛️' }
  ];
  
  // Simple markdown renderer for basic formatting
  const renderMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Handle headers
      if (line.startsWith('### ')) {
        elements.push(<h4 key={i} className="text-lg font-semibold mt-4 mb-2 text-gray-800">{line.substring(4)}</h4>);
      }
      else if (line.startsWith('## ')) {
        elements.push(<h3 key={i} className="text-xl font-semibold mt-6 mb-3 text-gray-800">{line.substring(3)}</h3>);
      }
      else if (line.startsWith('# ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-gray-800">{line.substring(2)}</h2>);
      }
      // Handle code blocks that span multiple lines
      else if (line.startsWith('```')) {
        const codeLines = [];
        i++; // Skip the opening ```
        
        // Collect all lines until closing ```
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        
        // Render the code block
        elements.push(
          <div key={i} className="bg-gray-100 border border-gray-300 rounded p-3 my-3 font-mono text-sm">
            {codeLines.map((codeLine, idx) => (
              <div key={idx}>{codeLine}</div>
            ))}
          </div>
        );
      }
      // Handle bullet points
      else if (line.startsWith('• ')) {
        elements.push(<li key={i} className="ml-4 mb-1 list-disc">{line.substring(2)}</li>);
      }
      // Handle empty lines
      else if (line.trim() === '') {
        elements.push(<br key={i} />);
      }
      // Handle regular paragraphs with bold text
      else {
        // Handle bold text **text**
        const parts = line.split(/(\*\*.*?\*\*)/);
        const formattedLine = parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        
        elements.push(<p key={i} className="mb-3">{formattedLine}</p>);
      }
      
      i++;
    }
    
    return elements;
  };
  
  // Find the current topic based on the URL parameter
  useEffect(() => {
    if (!topicId) {
      // If no topic is specified, navigate to the first one
      navigate(`/learn/${topics[0].id}`);
      return;
    }
    
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      setCurrentTopic(topic);
      setIsLoading(true);
      
      // Set explanation based on topic without AI service
      let topicExplanation = '';
      switch(topic.id) {
        case 'ctoken':
          topicExplanation = `A cToken is a token you receive when you supply assets to the Compound Protocol. These tokens represent your claim on the underlying asset plus any interest that has accrued.

Key Features of cTokens:
• They automatically earn interest through their exchange rate
• The exchange rate increases over time as interest compounds
• You can redeem them anytime for the underlying asset
• They can be used as collateral for borrowing

For example, when you supply DAI to Compound, you receive cDAI tokens. As interest accrues, each cDAI becomes worth more DAI, allowing you to redeem more DAI than you originally supplied.`;
          break;
        case 'apy':
          topicExplanation = `APY (Annual Percentage Yield) represents the real rate of return earned on an investment, taking into account the effect of compounding interest.

Understanding APY in Compound:
• Shows your expected yearly return with compounding
• Updates continuously based on market conditions
• Higher utilization typically means higher APY
• Compound interest makes APY higher than simple interest rates

APY is different from APR (Annual Percentage Rate) because it includes the compounding effect, giving you a more accurate picture of your potential earnings.`;
          break;
        case 'collateral':
          topicExplanation = `Collateral Factor determines what percentage of your supplied assets can be used as collateral for borrowing.

How Collateral Factors Work:
• Each asset has a specific collateral factor (e.g., ETH: 82.5%)
• This percentage determines your maximum borrowing power
• Lower factors mean the asset is considered riskier
• You can supply assets without using them as collateral

For example, if you supply $1000 worth of ETH with an 82.5% collateral factor, you can borrow up to $825 worth of other assets.`;
          break;
        case 'liquidation':
          topicExplanation = `Liquidation occurs when a borrower's collateral value falls below the required threshold, putting the protocol at risk.

Understanding Liquidation:
• Happens when borrowed amount exceeds collateral × collateral factor
• Liquidators can repay part of the debt and receive collateral at a discount
• Borrowers lose some collateral but have their debt reduced
• Prevention is key - monitor your account health regularly

To avoid liquidation, maintain a healthy collateral ratio by either adding more collateral or repaying some of your debt when prices move against you.`;
          break;
        case 'interest':
          topicExplanation = `Interest rates in Compound are determined algorithmically based on supply and demand, specifically the utilization rate of each market.

How Interest Rates Work:
• Utilization Rate = Total Borrows ÷ Total Supply
• Higher utilization leads to higher interest rates
• Rates adjust automatically with each transaction
• Both supply and borrow rates increase with utilization

This creates a natural balance - when demand for borrowing is high, suppliers are incentivized with higher rates, and borrowers face higher costs, which helps balance the market.`;
          break;
        case 'governance':
          topicExplanation = `COMP is the governance token that allows holders to propose and vote on changes to the Compound Protocol.

Governance Features:
• COMP holders can vote on protocol changes
• Proposals require significant token support to pass
• Voting power is proportional to token holdings
• Governance controls parameters like interest rate models and collateral factors

COMP tokens are distributed to users who supply or borrow assets, giving active participants a voice in the protocol's future development.`;
          break;
        default:
          topicExplanation = `Learn about ${topic.title} and how it works in the Compound Protocol.`;
      }
      
      setExplanation({
        explanation: topicExplanation,
        source: 'built-in'
      });
      setIsLoading(false);
    } else {
      // If topic doesn't exist, navigate to the first one
      navigate(`/learn/${topics[0].id}`);
    }
  }, [topicId, navigate]);
  
  // Toggle calculations display
  const toggleCalculations = () => {
    setShowCalculations(!showCalculations);
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-64 bg-white rounded-xl shadow-md p-4 h-fit">
          <h2 className="text-lg font-semibold mb-4">DeFi Topics</h2>
          <nav className="space-y-1">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => navigate(`/learn/${topic.id}`)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  currentTopic?.id === topic.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                } ${user.completedTopics && user.completedTopics.includes(topic.id) ? 'font-medium' : ''}`}
              >
                <span className="mr-2">{topic.icon}</span>
                <span>{topic.title}</span>
                {user.completedTopics && user.completedTopics.includes(topic.id) && (
                  <span className="ml-auto text-green-500">✓</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Topic Header */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl mr-4">
                  {currentTopic?.icon}
                </div>
                <h1 className="text-2xl font-bold">{currentTopic?.title}</h1>
              </div>
              
              {/* Explanation */}
              <div className="prose max-w-none mb-8">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {explanation.explanation}
                </div>
              </div>
              
              {/* Calculation Explanation Toggle */}
              <div className="mb-8">
                <button
                  onClick={toggleCalculations}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    {showCalculations ? (
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    )}
                  </svg>
                  {showCalculations ? 'Hide Calculations' : 'Show How It\'s Calculated'}
                </button>
              </div>
              
              {/* Calculation Explanations */}
              {showCalculations && calculationExplanations[topicId] && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">{calculationExplanations[topicId].title}</h3>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-800 font-medium mr-2">Key Formula:</span>
                      <code className="bg-white px-2 py-1 rounded border border-yellow-200">
                        {calculationExplanations[topicId].formula}
                      </code>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    {renderMarkdown(calculationExplanations[topicId].explanation)}
                  </div>
                </div>
              )}
              
              {/* Interactive Elements */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="mr-2">💡</span> Key Takeaway
                </h3>
                <p className="text-gray-700">
                  {currentTopic?.id === 'ctoken' && 'cTokens represent your deposits in Compound and automatically earn interest through their exchange rate.'}
                  {currentTopic?.id === 'apy' && 'APY (Annual Percentage Yield) shows your expected yearly return with compounding interest.'}
                  {currentTopic?.id === 'collateral' && 'Collateral Factor determines how much you can borrow against your supplied assets.'}
                  {currentTopic?.id === 'liquidation' && 'Liquidation happens when your borrowed amount exceeds your allowed borrowing limit.'}
                  {currentTopic?.id === 'interest' && 'Interest rates in Compound adjust automatically based on supply and demand.'}
                  {currentTopic?.id === 'governance' && 'COMP token holders can propose and vote on changes to the Compound protocol.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnModule;
