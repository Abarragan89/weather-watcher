"use strict";
$(document).foundation();
const apiKey = "8b169dfd2096fa29542212c363f5739e";
const searchEl = document.querySelector("#submit")
const buttonDivEl = document.querySelector("#city-list")
const degreeSymbol = String.fromCharCode(176);

// Make a date with optional added days
const getCurrentDate = function (addDays, elementId, long) {
    // Make date
    const today = new Date();
    today.setDate(today.getDate() + addDays)
    const month = today.toLocaleString('defualt', { month: 'long' });
    const monthNum = today.getMonth() + 1;
    const date = today.getDate();
    const year = today.getFullYear();
    // long or short style and appending
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
const getUVIndex = function (lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const uvIndexEl = document.getElementById("current-uvIndex")
    uvIndexEl.removeAttribute("class")
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const uvIndex = data.daily[0].uvi;
            if (uvIndex < 4) {
                uvIndexEl.classList.add("label", "success");
                uvIndexEl.textContent = uvIndex;
            } else if (uvIndex < 8) {
                uvIndexEl.classList.add("label", "warning");
                uvIndexEl.textContent = uvIndex;
            } else {
                uvIndexEl.classList.add("label", "alert");
                uvIndexEl.textContent = uvIndex;
            }
        })
}
const getCurrentCityWeatherInfo = function (event) {
    getCurrentDate(0, "current-date", "long");
    event.preventDefault();
    // Get the input value for city
    let city = document.querySelector("#selected-city").value;
    // Make url and fetch call
    findCity(city);
}

const forecast = function (day, noonTime) {
    getCurrentDate(day, `date-${day}`);
    let city = document.querySelector("#selected-city").value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            // Get and display temperature
            let temp = data.list[noonTime].main.temp;
            document.querySelector(`#temp-day-${day}`).textContent = `${temp}${degreeSymbol} F`;
            // Get and display wind
            let wind = data.list[noonTime].wind.speed;
            document.querySelector(`#wind-day-${day}`).textContent = `${wind} MPH`
            // Get and display humidity
            let humidity = data.list[noonTime].main.humidity;
            document.querySelector(`#humidity-day-${day}`).textContent = `${humidity}%`
            // Get and display icon
            let icon = data.list[noonTime].weather[0].icon;
            const iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
            document.querySelector(`#icon-day-${day}`).setAttribute("src", iconurl)
        })
}
// LOCAL STORAGE
const saveCity = function (city) {
    const cityList = document.getElementById("city-list");
    const listArray = cityList.childNodes;
    console.log(listArray)
    for (let i = 0; i < listArray.length; i++) {
        if (listArray[i].innerHTML === city) {
            return;
        }
    }
    const button = document.createElement("button");
    button.classList.add("button", "secondary");
    button.textContent = city;
    document.getElementById("city-list").appendChild(button);
    localStorage.setItem(localStorage.length, city);
}
const loadCities = function () {
    for (let i = 0; i < localStorage.length; i++) {
        const city = localStorage.getItem([i]);
        const button = document.createElement("button");
        button.classList.add("button", "secondary");
        button.textContent = city;
        document.getElementById("city-list").appendChild(button);
    }
}

const buttonSearch = function (event) {
    const city = event.target.innerHTML
    findCity(city);
    getCurrentDate(0, "current-date", "long")
    let noonTime = 4;
    for (let i = 1; i < 6; i++) {
        getCurrentDate(i, `date-${i}`);
        getForecast([i], city, noonTime);
        noonTime += 7;
    }
}



const findCity = function (city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
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
        // Get current UV Index (first get lat and lon)
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        getUVIndex(lat, lon)
        // Get city and save to local storage and display 
        let cityName = data.name
        document.querySelector("#current-city").textContent = cityName;
        saveCity(cityName)
    })
}

const getForecast = function (day, city, noonTime) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        // Get and display temperature
        let temp = data.list[noonTime].main.temp;
        document.querySelector(`#temp-day-${day}`).textContent = `${temp}${degreeSymbol} F`;
        // Get and display wind
        let wind = data.list[noonTime].wind.speed;
        document.querySelector(`#wind-day-${day}`).textContent = `${wind} MPH`
        // Get and display humidity
        let humidity = data.list[noonTime].main.humidity;
        document.querySelector(`#humidity-day-${day}`).textContent = `${humidity}%`
        // Get and display icon
        let icon = data.list[noonTime].weather[0].icon;
        const iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        document.querySelector(`#icon-day-${day}`).setAttribute("src", iconurl)
    })
}

const loadCurrentLocation = () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
            fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                // Display Current Date
                getCurrentDate(0, "current-date", "long");
                // Display Current City
                document.querySelector("#current-city").textContent = "Current Location";
                // Get current temperature
                let currentTemp = data.current.temp;
                currentTemp = currentTemp.toFixed(0);
                document.querySelector("#current-temp").textContent = `${currentTemp}${degreeSymbol} F`;
                // Get current wind
                let currentWind = data.current.wind_speed;
                document.querySelector("#current-wind").textContent = `${currentWind} MPH`
                // Get current humidity
                let currentHumidity = data.current.humidity;
                document.querySelector("#current-humidity").textContent = `${currentHumidity}%`
                // Get Icon
                let icon = data.current.weather[0].icon;
                const iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                document.querySelector("#current-icon").setAttribute("src", iconurl)
                // Get and display current UV Index
                let uvIndex = data.current.uvi;
                const uvIndexEl = document.getElementById("current-uvIndex")
                if (uvIndex < 4) {
                    uvIndexEl.classList.add("label", "success");
                    uvIndexEl.textContent = uvIndex;
                } else if (uvIndex < 8) {
                    uvIndexEl.classList.add("label", "warning");
                    uvIndexEl.textContent = uvIndex;
                } else {
                    uvIndexEl.classList.add("label", "alert");
                    uvIndexEl.textContent = uvIndex;
                }
            })
        })
    }
}
loadCurrentLocation();
// Load buttons
loadCities();
// Click events and handlers
buttonDivEl.addEventListener("click", buttonSearch)
searchEl.addEventListener("click", getCurrentCityWeatherInfo);
searchEl.addEventListener("click", forecast.bind(event, 1, 4));
searchEl.addEventListener("click", forecast.bind(event, 2, 12));
searchEl.addEventListener("click", forecast.bind(event, 3, 20));
searchEl.addEventListener("click", forecast.bind(event, 4, 28));
searchEl.addEventListener("click", forecast.bind(event, 5, 36));