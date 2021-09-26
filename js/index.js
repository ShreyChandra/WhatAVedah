let searchButton = document.querySelector("#searchButtonId");
let currentCity, currentCityLat, currentCityLong, countryName;
let currentCityAndDateTitle = document.querySelector("#cityCurrentAndDate");
let currentCityTemp = document.querySelector(".temp");
let currentCityWind = document.querySelector(".wind");
let currentCityHumidity = document.querySelector(".humidity");
let currentCityUv = document.querySelector(".uv");
let cardElement1 = document.querySelector(".card1");

const apiKey = "47f166773e351368285402b79068ea73";

let cityCoordinatesApi = "";
let weatherApi = "";
let cardDateElement = "";
let cardIconElement = "";
let cardTempElement = "";
let cardWindElement = "";
let cardHumidityElement = "";
let allCityNamesSplit = [];
let allButtons = document.getElementById("cityList");

window.onload = () => {
  let previousCityNames = localStorage.getItem("cityName") || "";
  if (previousCityNames.length) {
    previousCityNames = previousCityNames.split(",");
    for (let i = 0; i < previousCityNames.length; i++) {
      let cityButton = document.createElement("button");
      cityButton.className = "cityButtons buttons";
      cityButton.innerText = previousCityNames[i];
      cityButton.setAttribute("value", previousCityNames[i]);
      allButtons.appendChild(cityButton);
    }
  }
};

const spinner = document.getElementById("spinner");

const cityCall = async (city) => {
  allButtons.innerHTML = "";
  // allButtons.style.visibility = "hidden";
  spinner.removeAttribute("hidden");
  try {
    cityCoordinatesApi = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    // getting the geo coordinates based on the city name
    const response = await fetch(cityCoordinatesApi);
    const data = await response.json();
    const cityData = weatherApiCall(data);
    return cityData;
  } catch (err) {
    alert("Oops! are you sure that's a city ?");
    window.location.reload();
  }
};

const weatherUpdate = async (LatLongData) => {
  const responseWeather = await fetch(LatLongData);
  const weatherData = await responseWeather.json();
  return weatherData;
};

const controllerFunc = async (evt) => {
  let city = "";
  if (evt.target.value != "") {
    city = evt.target.value;
  } else {
    city = document.querySelector(".cityNameInput").value;
  }
  const LatLongData = await cityCall(city);
  const weatherUpdates = await weatherUpdate(LatLongData);

  showWeather(weatherUpdates);
};

searchButton.addEventListener("click", controllerFunc);

allButtons.addEventListener("click", controllerFunc);

const setIcons = (icon, iconIDsky) => {
  let skycons = new Skycons({ color: "white" });
  skycons.play();
  return skycons.set(iconIDsky, Skycons[icon]);
};

const covertToHumanDate = (unixTimestamp) => {
  const milliseconds = unixTimestamp * 1000; // 1575909015000
  const dateObject = new Date(milliseconds);
  const humanDateFormat = dateObject.toLocaleString(); //2019-12-9 10:30:15
  const humanDate = humanDateFormat.split(",")[0];
  return humanDate;
};

const convertIcons = (weatherDesc) => {
  switch (weatherDesc) {
    case "Clouds":
      return "CLOUDY";
    case "Rain":
      return "RAIN";
    case "Thunderstorm":
      return "WIND";
    case "Mist":
      return "FOG";
    case "Clear":
      return "CLEAR_DAY";
  }
};

const createSearchButton = (currentCityName) => {
  let cityButton = document.createElement("button");
  cityButton.className = "cityButtons buttons";
  cityButton.innerText = currentCityName;
  cityButton.setAttribute("value", currentCityName);
  allButtons.appendChild(cityButton);
};

const weatherApiCall = (data) => {
  document.querySelector(".cityNameInput").value = "";
  currentCityLat = data[0].lat;
  currentCityLong = data[0].lon;
  countryName = data[0].country;
  currentCity = data[0].name;

  let previousCityNames = localStorage.getItem("cityName") || "";
  if (previousCityNames.length === 0) {
    allCityNamesSplit = [currentCity];
  } else {
    allCityNamesSplit = previousCityNames.split(",");
  }
  if (!allCityNamesSplit.includes(currentCity)) {
    if (allCityNamesSplit.length > 5) {
      allCityNamesSplit.shift();
      allCityNamesSplit.push(currentCity);
    } else {
      allCityNamesSplit.push(currentCity);
    }
  }

  if (previousCityNames.length === 0) {
    createSearchButton(currentCity);
  } else {
    for (let i = 0; i < allCityNamesSplit.length; i++) {
      createSearchButton(allCityNamesSplit[i]);
    }
  }

  localStorage.setItem("cityName", allCityNamesSplit.join());

  weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCityLat}&lon=${currentCityLong}&units=metric&exclude=minutely,hourly&appid=${apiKey}`;

  return weatherApi;
};

const showWeather = (data) => {
  spinner.setAttribute("hidden", "");
  let unixTimestamp = data.current.dt;
  let humanDate = covertToHumanDate(unixTimestamp);

  currentCityAndDateTitle.innerText = `${currentCity}, ${countryName} ${humanDate}`;
  currentCityTemp.innerText = `Temp: ${data.current.temp} °C`;
  currentCityWind.innerText = `Wind: ${Math.round(
    data.current.wind_speed * 3.6
  )} km/h`;
  currentCityHumidity.innerText = `Humidity: ${data.current.humidity} %`;

  if (data.current.uvi <= 3) {
    currentCityUv.style.backgroundColor = "green";
  } else if (data.current.uvi > 3 && data.current.uvi < 7) {
    currentCityUv.style.backgroundColor = "#E6D70E";
  } else {
    currentCityUv.style.backgroundColor = "red";
  }
  currentCityUv.innerText = `${data.current.uvi}`;
  let icon = convertIcons(data.current.weather[0].main);
  setIcons(icon, document.querySelector(".icon"));

  let cards = document.getElementsByClassName("card");
  for (let j = 0; j <= 4; j++) {
    cards[j].innerHTML = "";
  }

  for (let i = 1; i <= 5; i++) {
    let cardDate = covertToHumanDate(data.daily[i].dt);
    cardDateElement = document.createElement("p");
    cardDateElement.innerHTML = cardDate;
    let card = `.card` + i;
    let cardElement = document.querySelector(`${card}`);
    cardElement.appendChild(cardDateElement);

    let cardIcon = convertIcons(data.daily[i].weather[0].main);
    cardIconElement = document.createElement("canvas");
    cardIconElement.width = "30";
    cardIconElement.height = "30";
    cardIconElement.className = "cardIcon" + i;
    cardElement.appendChild(cardIconElement);
    setIcons(cardIcon, document.querySelector(`.cardIcon${i}`));

    let cardTemp = data.daily[i].temp.day;
    cardTempElement = document.createElement("p");
    cardTempElement.innerHTML = `Temp: ${cardTemp}`;
    cardElement.appendChild(cardTempElement);

    let cardWind = Math.round(data.daily[i].wind_speed * 3.6);
    cardWindElement = document.createElement("p");
    cardWindElement.innerHTML = `Wind: ${cardWind} km/h`;
    cardElement.appendChild(cardWindElement);

    let cardHumidity = data.daily[i].humidity;
    cardHumidityElement = document.createElement("p");
    cardHumidityElement.innerHTML = `Humidity: ${cardHumidity}`;
    cardElement.appendChild(cardHumidityElement);
  }
};
