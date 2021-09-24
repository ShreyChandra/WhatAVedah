var searchButton = document.querySelector("#searchButtonId");
let currentCity, currentCityLat, currentCityLong, countryName;

let currentCityAndDateTitle = document.querySelector("#cityCurrentAndDate");
let currentCityTemp = document.querySelector(".temp");
let currentCityWind = document.querySelector(".wind");
let currentCityHumidity = document.querySelector(".humidity");
let currentCityUv = document.querySelector(".uv");
let cityList = document.querySelector(".cityList");

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

searchButton.addEventListener("click", async () => {
  allButtons.innerHTML = "";

  currentCity = document.querySelector(".cityNameInput").value;
  cityCoordinatesApi = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=${apiKey}`;
  // getting the geo coordinates based on the city name
  const response = await fetch(cityCoordinatesApi);
  const data = await response.json();
  const cityData = weatherApiCall(data);

  const responseWeather = await fetch(cityData);
  const weatherData = await responseWeather.json();
  showWeather(weatherData);
});

const weatherApiCall = (data) => {
  // console.log(data);
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
    allCityNamesSplit.push(currentCity);
  }

  if (previousCityNames.length === 0) {
    let cityButton = document.createElement("button");
    cityButton.className = "cityButtons buttons";
    cityButton.innerText = currentCity;
    allButtons.appendChild(cityButton);
  } else {
    console.log("-----CITY-----");
    console.log(allCityNamesSplit);

    for (let i = 0; i < allCityNamesSplit.length; i++) {
      console.log(allCityNamesSplit[i]);
      let cityButton = document.createElement("button");
      cityButton.className = "cityButtons buttons";
      cityButton.innerText = allCityNamesSplit[i];
      allButtons.appendChild(cityButton);
    }
  }
  localStorage.setItem("cityName", allCityNamesSplit.join());

  weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCityLat}&lon=${currentCityLong}&units=metric&exclude=minutely,hourly&appid=${apiKey}`;

  return weatherApi;
};

const showWeather = (data) => {
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
