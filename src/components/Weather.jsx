import React, { useState, useEffect, useRef } from 'react'
import './weather.css'

const api = {
  key: "2a4bff6cbefecf5f6a289f4cbf4ec229",
  base: "https://api.openweathermap.org/data/2.5/"
}

// Weather icons and animations mapping
const weatherConfig = {
  Clear: { icon: "☀️", animation: "sunny" },
  Clouds: { icon: "☁️", animation: "cloudy" },
  Rain: { icon: "🌧️", animation: "rainy" },
  Drizzle: { icon: "🌦️", animation: "rainy" },
  Thunderstorm: { icon: "⛈️", animation: "thunderstorm" },
  Snow: { icon: "❄️", animation: "snowy" },
  Mist: { icon: "🌫️", animation: "misty" },
  Smoke: { icon: "💨", animation: "misty" },
  Haze: { icon: "🌫️", animation: "misty" },
  Dust: { icon: "💨", animation: "windy" },
  Fog: { icon: "🌫️", animation: "misty" },
  Sand: { icon: "💨", animation: "windy" },
  Ash: { icon: "🌋", animation: "misty" },
  Squall: { icon: "💨", animation: "windy" },
  Tornado: { icon: "🌪️", animation: "windy" }
}

function Weather() {
  const [search, setSearch] = useState("")
  const [weather, setWeather] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [locationPermission, setLocationPermission] = useState(null)
  const [isRequestingLocation, setIsRequestingLocation] = useState(false)

  const searchRef = useRef(null)

  // Fetch city suggestions from your Vercel API
  const fetchCities = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      // Use your Vercel API endpoint
      const response = await fetch(
        `https://weather-app-api-omega.vercel.app/api/cities?name=${encodeURIComponent(query)}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch cities')
      }

      const data = await response.json()
      setSuggestions(data)
      setShowSuggestions(data.length > 0)
    } catch (err) {
      console.error('Error fetching cities:', err)
      // Don't show error to user for suggestions to avoid disrupting UX
    }
  }

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    fetchCities(value)
  }

  // Search weather by city name
  const searchStart = (cityName = search) => {
    if (!cityName.trim()) {
      setError("Please enter a city name")
      return
    }

    setLoading(true)
    setError("")
    setShowSuggestions(false)
    
    fetch(`${api.base}weather?q=${cityName}&units=metric&APPID=${api.key}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('City not found')
        }
        return res.json()
      })
      .then((result) => {
        console.log(result)
        setWeather(result)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
        setWeather({})
      })
  }

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      return
    }

    setIsRequestingLocation(true)
    setError("")
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeatherByCoords(latitude, longitude)
        setLocationPermission('granted')
        setIsRequestingLocation(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setError("Unable to retrieve your location. Please allow location access or search for a city.")
        setLocationPermission('denied')
        setIsRequestingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  // Fetch weather by coordinates
  const fetchWeatherByCoords = (lat, lon) => {
    setLoading(true)
    setError("")
    
    fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Weather data not available')
        }
        return res.json()
      })
      .then((result) => {
        console.log(result)
        setWeather(result)
        setSearch(result.name) // Update search input with city name
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchStart()
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (city) => {
    setSearch(city.name)
    setShowSuggestions(false)
    searchStart(city.name)
  }

  // Get weather configuration
  const getWeatherConfig = (condition) => {
    return weatherConfig[condition] || { icon: "🌈", animation: "sunny" }
  }

  // Format date
  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="weather-app">
      {/* Header */}
      <div className="weather-header">
        <h1 className="weather-title">Weather Forecast</h1>
        <p className="weather-subtitle">Get real-time weather information for any city</p>
      </div>
      
      {/* Search Section */}
      <div className="search-container" ref={searchRef}>
        <div className="search-box">
          <input 
            type="text" 
            className="search-input"
            placeholder="Enter city name..." 
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => fetchCities(search)}
            value={search}
          />
          <button className="search-button" onClick={() => searchStart()}>
            {loading ? "Searching..." : "Get Weather"}
          </button>
          <button 
            className="location-button" 
            onClick={getCurrentLocation}
            title="Use my current location"
            disabled={isRequestingLocation}
          >
            📍
          </button>
        </div>

        {/* City Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="city-suggestions">
            {suggestions.map((city, index) => (
              <div
                key={`${city.name}-${city.country}-${index}`}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(city)}
              >
                {city.name}, {city.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location Permission Prompt */}
      {locationPermission === null && !weather.name && (
        <div className="location-permission">
          <p className="permission-text">
            Get weather for your current location for a personalized experience!
          </p>
          <div className="permission-buttons">
            <button 
              className="permission-btn permission-allow"
              onClick={getCurrentLocation}
            >
              Allow Location Access
            </button>
            <button 
              className="permission-btn permission-deny"
              onClick={() => setLocationPermission('denied')}
            >
              No Thanks
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Loading Animation */}
      {(loading || isRequestingLocation) && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{isRequestingLocation ? "Getting your location..." : "Fetching weather data..."}</p>
        </div>
      )}

      {/* Weather Display */}
      {typeof weather.main !== 'undefined' && !loading && (
        <div className="weather-card">
          {/* Location and Date */}
          <div className='location'>
            <div className="location-name">
              <span className="location-icon">📍</span>
              {weather.name}, {weather.sys.country}
            </div>
            <div className="location-date">{formatDate()}</div>
          </div>

          {/* Temperature */}
          <div className="temperature">
            <div className="temp-value">
              {Math.round(weather.main.temp)}
            </div>
            <div className="temp-feels-like">
              Feels like {Math.round(weather.main.feels_like)}°C
            </div>
          </div>

          {/* Weather Condition with Animated Icon */}
          <div className="weather-condition">
            <div className={`condition-main ${getWeatherConfig(weather.weather[0].main).animation}`}>
              <span className="weather-icon">
                {getWeatherConfig(weather.weather[0].main).icon}
              </span>
              {weather.weather[0].main}
            </div>
            <div className="condition-description">
              {weather.weather[0].description}
            </div>
          </div>

          {/* Additional Weather Details */}
          <div className="weather-details">
            <div className="weather-detail">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">💧 {weather.main.humidity}%</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">💨 {weather.wind.speed} m/s</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">📊 {weather.main.pressure} hPa</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">Visibility</span>
              <span className="detail-value">👁️ {(weather.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Weather