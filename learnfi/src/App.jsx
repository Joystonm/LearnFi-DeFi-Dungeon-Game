import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LearnModule from './pages/LearnModule';
import SimulateCompound from './pages/SimulateCompound';
import MarketData from './pages/MarketData';
import AdvancedFeatures from './pages/AdvancedFeatures';
import DeFiDungeon from './pages/DeFiDungeon';
import { UserProvider } from './context/UserContext';
import { CompoundProvider } from './context/CompoundContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <CompoundProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 overflow-y-auto overflow-x-hidden"
               style={{ height: '100vh', WebkitOverflowScrolling: 'touch' }}>
            <Routes>
              {/* Game route - full screen without header */}
              <Route path="/game" element={<DeFiDungeon />} />
              
              {/* Regular app routes with header only */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main className="flex-grow container mx-auto px-4 py-8 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/learn" element={<LearnModule />} />
                      <Route path="/learn/:topicId" element={<LearnModule />} />
                      <Route path="/simulate" element={<SimulateCompound />} />
                      <Route path="/market-data" element={<MarketData />} />
                      <Route path="/advanced-features" element={<AdvancedFeatures />} />
                    </Routes>
                  </main>
                </>
              } />
            </Routes>
          </div>
        </CompoundProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
