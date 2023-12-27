import React, { useState } from 'react'
// import './weather.css'

const api = {
  key: "2a4bff6cbefecf5f6a289f4cbf4ec229",
  base: "https://api.openweathermap.org/data/2.5/"
}


function Weather() {

  const [search, setSearch] = useState("")
  const [weather, setWeather] = useState({})

  const searchStart = () => {
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result)

        setWeather(result)
      })
  }

  const printer = () => {
    console.log(weather)
  }

  return (
    <div>
      {/* header */}
      <h1>Weather</h1>
      
      {/* Search */}
      <div className="search">
        <input type="text" placeholder='Search city...' onChange={(e) => setSearch(e.target.value)} />
        <button onClick={searchStart}>Search</button>
      </div>


      {typeof weather.main != 'undefined' ? (
        <div>

          {/* Location */}
          <div id='location'>
            {weather.name}
          </div>

          {/* Temperature  */}
          <div className="temp">
            {weather.main.temp}° C
          </div>

          {/* Condition  */}
          <div className="cond">
            {weather.weather[0].main} <br />
            {weather.weather[0].description}
          </div>
        </div>
      ) : ""}



    </div>
  )
}

export default Weather