"use strict";
$(document).foundation();
const apiKey = "8b169dfd2096fa29542212c363f5739e";
const searchEl = document.querySelector("#submit")
const degreeSymbol = String.fromCharCode(176);

const getCurrentDate = function (num, elementId, long) {
    // Make date
    const today = new Date();
    today.setDate(today.getDate() + num)
    const month = today.toLocaleString('defualt', { month: 'long' });
    const monthNum = today.getMonth() + 1;
    const date = today.getDate();
    const year = today.getFullYear();
    if (long) {
        const currentDate = `(${month} / ${date} / ${year})`
        const dateEl = document.getElementById(elementId)
        dateEl.textContent = currentDate;
    } else {
        const currentDate = `${monthNum}/${date}/${year}`
        const dateEl = document.getElementById(elementId)
        dateEl.textContent = currentDate;
    }
}


const getCurrentCityWeatherInfo = function (event) {
    getCurrentDate(0, "current-date", "long");
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
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
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
            document.querySelector("#current-humidity").textContent = `${currentHumidity}%`

            // Get Icon
            let icon = data.weather[0].icon;
            const iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
            document.querySelector("#current-icon").setAttribute("src", iconurl)
            // Get current UV Index
            // let currentUV = data.
        })
}
const forecast = function () {
    getCurrentDate(1, "date-1");
    let city = document.querySelector("#selected-city").value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            // Get and display temperature
            let temp = data.list[4].main.temp;
            document.querySelector("#temp-day-1").textContent = `${temp}${degreeSymbol} F`;
            // Get and display wind
            let wind = data.list[4].wind.speed;
            document.querySelector("#wind-day-1").textContent = `${wind} MPH`
            // Get and display humidity
            let humidity = data.list[4].main.humidity;
            document.querySelector("#humidity-day-1").textContent= `${humidity}%`
            // Get and display icon
            let icon = data.list[4].weather[0].icon;
            console.log(icon);
            const iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
            document.querySelector("#icon-day-1").setAttribute("src", iconurl)
            
        })
}

searchEl.addEventListener("click", getCurrentCityWeatherInfo);
searchEl.addEventListener("click", forecast);

