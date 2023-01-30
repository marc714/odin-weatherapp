// api doc: https://openweathermap.org/api/geocoding-api
// usa only

const searchBtn = document.querySelector('#submit');
searchBtn.addEventListener('click', displayWeather);

function formValues(){
    const city = document.querySelector('#city-field').value;
    const state = document.querySelector('#state-field').value;
    const location = {
        city: city,
        state: state
    };
    return location;    
}

function displayWeather(e){
    e.preventDefault();
    let temp = formValues();    
    geoCode(temp.city, temp.state)
        .then(jsonify)
        .then(coordinates)
        .then(getWeather)
        .then(updateDisplay)
}

async function geoCode(city, state){
    try {
        const retrieve = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},1&limit=1&appid=7ac6fa3f4615d9a890f455a43b5c4f9d
    `);
        return retrieve; // pass to jsonify()
    } catch {
        console.log("api error")
    }
}

async function jsonify(promise){
    const results = await promise.json()
    return results; // pass to coordinates()
}

async function coordinates(jsonObject){
    const results = await jsonObject;
    const array = [results[0].lat, results[0].lon]
    return array; // pass to getWeather()
}

async function getWeather(array){
    const lat = array[0];
    const lon = array[1];
    try {
        const retrieve = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=7ac6fa3f4615d9a890f455a43b5c4f9d`)
        const results = await retrieve.json();
        console.log(results);
        const city = results.name;
        const temp = results.main.temp;
        const main = results.weather[0].main;
        const description = results.weather[0].description;
        const resultsArray = [city, temp, main, description];
        return resultsArray; // pass to updateDisplay()
    } catch {
        console.log("no lat and lon exist");
    }

}

function background(){
    const body = document.querySelector("#body");
    body.style.background = "#f3f3f3 url('https://source.unsplash.com/LtWFFVi1RXQ') no-repeat";
    body.style.backgroundSize = "cover";
}; // next update, change background based off conditions

function updateDisplay(array){
    const city = document.querySelector(".city");
    const temp = document.querySelector('.temp');
    const main = document.querySelector(".main");
    const description = document.querySelector(".description");    
    city.textContent = array[0];
    temp.textContent = "temp °F: " + array[1];
    main.textContent = array[2];    
    description.textContent = array[3];
}

const onLoad = (()=> {
    background()
    geoCode("Irvine", "CA")
    .then(jsonify)
    .then(coordinates)
    .then(getWeather)
    .then(updateDisplay)
})()