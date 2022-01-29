"use strict";
$(document).foundation();

const getCurrentDate = function () {
    // Make date
    const today = new Date();
    const month = today.toLocaleString('defualt', {month: 'long'})
    const date = today.getDate();
    const year = today.getFullYear();
    const currentDate = `${month} / ${date} / ${year}`
    console.log(currentDate)
    // Append date to element
    const dateEl = document.getElementById("current-date")
    dateEl.textContent = currentDate;
}

getCurrentDate();