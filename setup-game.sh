#!/bin/bash

echo "🏰 Setting up DeFi Dungeon Game..."
echo "=================================="

# Navigate to the project directory
cd learnfi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if the game files exist
if [ -f "src/pages/DeFiDungeon.jsx" ]; then
    echo "✅ Game files are ready"
else
    echo "❌ Game files missing - please ensure all files are created"
    exit 1
fi

echo ""
echo "🎮 DeFi Dungeon is ready to play!"
echo "=================================="
echo ""
echo "To start the game:"
echo "1. Run: npm start"
echo "2. Open: http://localhost:3000"
echo "3. Click: '🎮 Play DeFi Dungeon'"
echo ""
echo "Game Features:"
echo "• 🏰 10+ dungeon rooms with DeFi challenges"
echo "• ⚔️ Battle system using real Compound mechanics"
echo "• 🧩 Educational puzzles and quizzes"
echo "• 🏆 Badge collection and XP progression"
echo "• 💰 Portfolio management and risk assessment"
echo "• 📊 Real-time health factor monitoring"
echo ""
echo "Happy learning and gaming! 🚀"
