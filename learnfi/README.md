# LearnFi

LearnFi is an interactive platform that helps users learn DeFi concepts through hands-on experience with the Compound Protocol. The application combines educational content with practical simulations to make DeFi learning accessible and engaging.

## Features

- Interactive learning modules for DeFi concepts
- Compound Protocol integration for real-world examples
- AI-powered explanations using Groq API
- Knowledge testing with Tavily API
- Progress tracking and gamification elements

## Project Structure

- `services/`: Integration with Compound.js, Groq, and Tavily APIs
- `components/`: Modular React components for gamified UI (badges, tooltips)
- `context/`: Management of user progress and compound market data
- `hooks/`: Custom hooks like useCompound() to abstract logic
- `data/glossary.js`: Predefined explanations as fallback

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your API keys
4. Run the development server with `npm start`

## Technologies Used

- React
- Compound.js
- Groq AI API
- Tavily API
- Tailwind CSS
