# Weather App

A modern, responsive weather application built with React that provides real-time weather information for cities worldwide. Features beautiful animations, geolocation support, and intelligent city suggestions.

## 🌟 Features

- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **Smart City Search**: Auto-complete suggestions powered by API Ninjas
- **Geolocation Support**: Automatic weather detection based on your current location
- **Beautiful Animations**: Dynamic weather icons with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Secure API Integration**: Protected API keys using Vercel serverless functions

## 🛠️ Technologies Used

### Frontend
- **React** - UI framework
- **CSS3** - Modern styling with animations and gradients
- **JavaScript ES6+** - Application logic

### Backend & APIs
- **Vercel Serverless Functions** - Secure API proxy
- **OpenWeatherMap API** - Weather data
- **API Ninjas Cities API** - City suggestions
- **Browser Geolocation API** - Location services

## 🚀 Live Demo

Visit the live application: [https://yashasvi9199.github.io/weather-app](https://yashasvi9199.github.io/weather-app)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashasvi9199/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server** 
   ```bash
   npm start
   ```

4. **Open the application in your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📝 License

# Setup Guide for Forked Repositories

## City Suggestions API Setup

This app uses a restricted Vercel API. To enable city suggestions in your forked version:

1. **Get API Ninjas Key**:
   - Sign up at [API Ninjas](https://api-ninjas.com/)
   - Get your free API key

2. **Deploy Your Own Vercel API**:
   - Fork and deploy the API from: [weather-app-api](https://github.com/your-repo/weather-app-api)
   - Set `API_NINJAS_KEY` environment variable in Vercel

3. **Update API URL in Weather.jsx**:
   ```javascript
   // Replace with your Vercel API URL
   const response = await fetch(
     `https://your-vercel-app.vercel.app/api/cities?name=${encodeURIComponent(query)}`
   );