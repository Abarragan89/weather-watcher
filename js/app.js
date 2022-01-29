"use strict";
$(document).foundation();
const apiKey = "8b169dfd2096fa29542212c363f5739e";
const searchEl = document.querySelector("#submit")
const degreeSymbol = String.fromCharCode(176);

const getCurrentDate = function () {
    // Make date
    const today = new Date();
    const month = today.toLocaleString('defualt', {month: 'long'})
    const date = today.getDate();
    const year = today.getFullYear();
    const currentDate = `(${month} / ${date} / ${year})`
    console.log(currentDate)
    // Append date to element
    const dateEl = document.getElementById("current-date")
    dateEl.textContent = currentDate;
}

getCurrentDate();

const getCurrentCityWeatherInfo = function (event) {
    event.preventDefault();
    // Get the input value for city
    let city = document.querySelector("#selected-city").value; 
    // Format city name for display
    let cityFormatted = "";
    city = city.split(" ");
    if (city.length > 0) {
        for (let i = 0; i < city.length; i++) {
            cityFormatted += city[i].charAt(0).toUpperCase() + city[i].slice(1) + " ";
            document.querySelector("#current-city").textContent = cityFormatted
        }
    } else {
        cityFormatted = city.charAt(0).toUpperCase() + city.slice(1);
        document.querySelector("#current-city").textContent = cityFormatted;
    }
    // Make url and fetch call
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityFormatted}&appid=${apiKey}&units=imperial`;
    fetch(url)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data)
            // Get current temperature
            let currentTemp = data.main.temp;
            currentTemp = currentTemp.toFixed(0);
            document.querySelector("#current-temp").textContent = `${currentTemp}${degreeSymbol} F`;
            // Get current wind
            let currentWind = data.wind.speed;
            document.querySelector("#current-wind").textContent = `${currentWind} MPH`
            // Get current humidity
            let currentHumidity = data.main.humidity;
            console.log(currentHumidity)
            document.querySelector("#current-humidity").textcontent = `${currentHumidity}%`
            // Get current UV Index
            // let currentUV = data.

            
        })
}

searchEl.addEventListener("click", getCurrentCityWeatherInfo);
