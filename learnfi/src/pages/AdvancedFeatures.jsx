import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TutorialSystem from '../components/TutorialSystem';
import MarketStressTesting from '../components/MarketStressTesting';
import HistoricalScenario from '../components/HistoricalScenario';
import MultiStepSimulation from '../components/MultiStepSimulation';
import AdvancedQuiz from '../components/AdvancedQuiz';
import ScenarioQuestion from '../components/ScenarioQuestion';
import TimedChallenge from '../components/TimedChallenge';
import StrategyRecommendation from '../components/StrategyRecommendation';

const AdvancedFeatures = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('advanced-simulations');
  const [showTutorial, setShowTutorial] = useState(true);
  
  // Tutorial steps for the advanced features page
  const tutorialSteps = [
    {
      title: 'Welcome to Advanced Features',
      description: 'This page contains advanced learning and simulation features of LearnFi. Let me guide you through what\'s available.',
      action: 'Click "Next" to continue the tutorial.'
    },
    {
      title: 'Advanced Simulations',
      description: 'Test your strategies under different market conditions with stress testing, historical scenarios, and multi-step transactions.',
      action: 'Click on the "Advanced Simulations" tab to see these features.'
    },
    {
      title: 'Advanced Quizzes',
      description: 'Challenge yourself with different difficulty levels, scenario-based questions, and timed challenges to test your knowledge.',
      action: 'Click on the "Advanced Quizzes" tab to see the quiz options.'
    },
    {
      title: 'Strategy Tools',
      description: 'Use advanced tools to develop and optimize your DeFi strategies, including our new DeFi Dungeon game!',
      action: 'Click on the "Strategy Tools" tab to explore these options.'
    },
    {
      title: 'You\'re All Set!',
      description: 'Now you know all about the advanced features available in LearnFi. Feel free to explore each section at your own pace.',
      action: 'Click "Finish" to end the tutorial and start exploring.'
    }
  ];
  
  // Handle tutorial completion
  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">Advanced Features</h1>
        <p className="text-gray-600">
          Explore advanced learning and simulation features to deepen your understanding of DeFi and the Compound Protocol.
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'advanced-simulations'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('advanced-simulations')}
            >
              Advanced Simulations
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'advanced-quizzes'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('advanced-quizzes')}
            >
              Advanced Quizzes
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'strategy-tools'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('strategy-tools')}
            >
              Strategy Tools
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'advanced-simulations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Advanced Simulations</h2>
              <p className="text-gray-600 mb-6">
                Test your strategies under different market conditions and scenarios to better understand risk and opportunity.
              </p>
              
              <div className="space-y-8">
                <MarketStressTesting />
                <HistoricalScenario />
                <MultiStepSimulation />
              </div>
            </div>
          )}
          
          {activeTab === 'advanced-quizzes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Advanced Quizzes</h2>
              <p className="text-gray-600 mb-6">
                Test your knowledge with different types of quizzes and challenges.
              </p>
              
              <div className="space-y-8">
                <AdvancedQuiz topic="ctoken" difficulty="medium" />
                <ScenarioQuestion />
                <TimedChallenge difficulty="medium" />
              </div>
            </div>
          )}
          
          {activeTab === 'strategy-tools' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Strategy Tools</h2>
              <p className="text-gray-600 mb-6">
                Advanced tools to help you develop and optimize your DeFi strategies.
              </p>
              
              <div className="space-y-8">
                <StrategyRecommendation />
                
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <span className="mr-2">🎮</span>
                    DeFi Dungeon Game
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Experience our gamified learning adventure where you master DeFi concepts through interactive gameplay and challenges!
                  </p>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
                    onClick={() => navigate('/game')}
                  >
                    🚀 Play DeFi Dungeon
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tutorial System */}
      {showTutorial && (
        <TutorialSystem
          tutorialId="advanced-features-intro"
          steps={tutorialSteps}
          onComplete={handleTutorialComplete}
        />
      )}
    </div>
  );
};

export default AdvancedFeatures;
