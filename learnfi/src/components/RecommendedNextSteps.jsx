import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCompound } from '../context/CompoundContext';

const RecommendedNextSteps = () => {
  const { user } = useUser();
  const { userCompound } = useCompound();
  const [recommendations, setRecommendations] = useState([]);
  
  // Generate recommendations based on user activity
  useEffect(() => {
    const generateRecommendations = () => {
      const newRecommendations = [];
      
      // Check completed topics
      const completedTopics = user.completedTopics || [];
      const allTopics = ['ctoken', 'apy', 'collateral', 'liquidation', 'interest', 'governance'];
      const incompleteTopics = allTopics.filter(topic => !completedTopics.includes(topic));
      
      // Check if user has supplied or borrowed assets
      const hasSupplied = Object.keys(userCompound.supplied || {}).length > 0;
      const hasBorrowed = Object.keys(userCompound.borrowed || {}).length > 0;
      
      // Recommendation: Complete learning modules
      if (incompleteTopics.length > 0) {
        // Prioritize based on user activity
        let priorityTopic;
        
        if (!hasSupplied && !hasBorrowed) {
          // New user - recommend cToken or APY first
          priorityTopic = incompleteTopics.find(topic => ['ctoken', 'apy'].includes(topic));
        } else if (hasSupplied && !hasBorrowed) {
          // User has supplied but not borrowed - recommend collateral or borrowing
          priorityTopic = incompleteTopics.find(topic => ['collateral', 'liquidation'].includes(topic));
        } else {
          // User has borrowed - recommend advanced topics
          priorityTopic = incompleteTopics.find(topic => ['interest', 'governance'].includes(topic));
        }
        
        // If no priority topic found, use the first incomplete topic
        const nextTopic = priorityTopic || incompleteTopics[0];
        
        // Get topic details
        const topicDetails = {
          ctoken: { title: 'What is a cToken?', description: 'Learn about the tokenization of deposits in Compound' },
          apy: { title: 'Understanding APY', description: 'Discover how interest accrues in DeFi lending protocols' },
          collateral: { title: 'Collateral Factor', description: 'Learn how borrowing capacity is determined' },
          liquidation: { title: 'Liquidation Risk', description: 'Understand the risks of borrowing in DeFi' },
          interest: { title: 'Interest Rate Models', description: 'Explore how interest rates are determined' },
          governance: { title: 'Compound Governance', description: 'Learn how protocol parameters are adjusted' }
        };
        
        newRecommendations.push({
          id: 'learn-module',
          title: `Learn: ${topicDetails[nextTopic].title}`,
          description: topicDetails[nextTopic].description,
          action: 'Start Learning',
          path: `/learn/${nextTopic}`,
          priority: 'high',
          icon: '📚'
        });
      }
      
      // Recommendation: Try simulation if user hasn't supplied yet
      if (!hasSupplied) {
        newRecommendations.push({
          id: 'try-supply',
          title: 'Try Supplying Assets',
          description: 'Experience how supplying assets works in the Compound Protocol',
          action: 'Start Simulation',
          path: '/simulate',
          priority: completedTopics.length > 0 ? 'high' : 'medium',
          icon: '💰'
        });
      }
      
      // Recommendation: Try borrowing if user has supplied but not borrowed
      if (hasSupplied && !hasBorrowed) {
        newRecommendations.push({
          id: 'try-borrow',
          title: 'Try Borrowing Assets',
          description: 'Learn how to borrow against your supplied collateral',
          action: 'Start Simulation',
          path: '/simulate',
          priority: 'high',
          icon: '🏦'
        });
      }
      
      // Recommendation: Check market data
      newRecommendations.push({
        id: 'market-data',
        title: 'Explore Market Data',
        description: 'Analyze current rates and market conditions',
        action: 'View Markets',
        path: '/market-data',
        priority: hasSupplied || hasBorrowed ? 'medium' : 'low',
        icon: '📊'
      });
      
      // Recommendation: Try advanced simulation features
      if (hasSupplied && hasBorrowed) {
        newRecommendations.push({
          id: 'advanced-simulation',
          title: 'Try Advanced Simulations',
          description: 'Experiment with market stress testing and multi-step transactions',
          action: 'Advanced Simulation',
          path: '/simulate',
          priority: 'medium',
          icon: '🧪'
        });
      }
      
      // Recommendation: Complete skill assessment if not done yet
      const hasCompletedAssessment = localStorage.getItem('skillAssessment') !== null;
      if (!hasCompletedAssessment) {
        newRecommendations.push({
          id: 'skill-assessment',
          title: 'Take Skill Assessment',
          description: 'Get a personalized learning path based on your knowledge level',
          action: 'Start Assessment',
          path: '/dashboard',
          priority: 'medium',
          icon: '📝'
        });
      }
      
      // Sort recommendations by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      newRecommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      
      setRecommendations(newRecommendations);
    };
    
    generateRecommendations();
  }, [user.completedTopics, userCompound.supplied, userCompound.borrowed]);
  
  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🧭</span> Recommended Next Steps
        </h2>
        <p className="text-sm text-indigo-100">
          Personalized suggestions based on your progress
        </p>
      </div>
      
      <div className="p-6">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block p-4 rounded-full bg-indigo-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">You're All Caught Up!</h3>
            <p className="text-gray-600 mb-6">
              You've completed all the recommended activities. Great job!
            </p>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <div 
                key={recommendation.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">
                      {recommendation.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{recommendation.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority === 'high' ? 'Recommended' : 
                           recommendation.priority === 'medium' ? 'Suggested' : 'Optional'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                      <Link
                        to={recommendation.path}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        {recommendation.action}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedNextSteps;
