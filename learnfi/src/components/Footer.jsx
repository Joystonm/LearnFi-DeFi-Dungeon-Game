import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-2">
                LF
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LearnFi
              </span>
            </div>
            <p className="text-sm text-gray-600">
              The gamified, AI-powered DeFi playground that makes learning about Compound Protocol fun and interactive.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</Link>
              </li>
              <li>
                <Link to="/learn" className="text-sm text-gray-600 hover:text-blue-600">Learn DeFi</Link>
              </li>
              <li>
                <Link to="/simulate" className="text-sm text-gray-600 hover:text-blue-600">Simulate Compound</Link>
              </li>
              <li>
                <Link to="/market-data" className="text-sm text-gray-600 hover:text-blue-600">Market Data</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://docs.compound.finance/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600">Compound Docs</a>
              </li>
              <li>
                <a href="https://compound.finance/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600">Compound Protocol</a>
              </li>
              <li>
                <a href="https://github.com/compound-finance/compound-js" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600">Compound.js</a>
              </li>
              <li>
                <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600">Groq API</a>
              </li>
              <li>
                <a href="https://tavily.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600">Tavily API</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">About</h3>
            <p className="text-sm text-gray-600 mb-4">
              LearnFi is an educational platform designed to help users understand DeFi concepts through interactive learning and simulation.
            </p>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} LearnFi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
