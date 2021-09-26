const searchButton = document.querySelector("#searchButtonId"),
  currentCityAndDateTitle = document.querySelector("#cityCurrentAndDate"),
  currentCityTemp = document.querySelector(".temp"),
  currentCityWind = document.querySelector(".wind"),
  currentCityHumidity = document.querySelector(".humidity"),
  currentCityUv = document.querySelector(".uv"),
  cardElement1 = document.querySelector(".card1"),
  allButtons = document.getElementById("cityList"),
  searchBox = document.querySelector(".cityNameInput"),
  cards = document.getElementsByClassName("card"),
  spinner = document.getElementById("spinner");

const apiKey = "47f166773e351368285402b79068ea73",
  localStorageKey = "cityName";

const cityCall = async (city) => {
  spinner.removeAttribute("hidden");
  try {
    const cityCoordinatesApi = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    // getting the geo coordinates based on the city name
    const response = await fetch(cityCoordinatesApi);
    const data = await response.json();
    const { weatherApi, countryName, currentCity } = weatherApiCall(data);
    return {
      weatherApi,
      countryName,
      currentCity,
    };
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
  const currentCityLat = data[0].lat,
    currentCityLong = data[0].lon,
    countryName = data[0].country,
    currentCity = data[0].name;

  let weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCityLat}&lon=${currentCityLong}&units=metric&exclude=minutely,hourly&appid=${apiKey}`;

  return {
    weatherApi,
    countryName,
    currentCity,
  };
};

const showWeather = (data, countryName, currentCity) => {
  spinner.setAttribute("hidden", "");
  searchBox.value = "";
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

  for (let j = 0; j <= 4; j++) {
    cards[j].innerHTML = "";
  }

  for (let i = 1; i <= 5; i++) {
    let cardDate = covertToHumanDate(data.daily[i].dt),
      cardDateElement = document.createElement("p");
    cardDateElement.innerHTML = cardDate;
    let card = `.card` + i;
    let cardElement = document.querySelector(`${card}`);
    cardElement.appendChild(cardDateElement);

    let cardIcon = convertIcons(data.daily[i].weather[0].main),
      cardIconElement = document.createElement("canvas");
    cardIconElement.width = "30";
    cardIconElement.height = "30";
    cardIconElement.className = "cardIcon" + i;
    cardElement.appendChild(cardIconElement);
    setIcons(cardIcon, document.querySelector(`.cardIcon${i}`));

    let cardTemp = data.daily[i].temp.day,
      cardTempElement = document.createElement("p");
    cardTempElement.innerHTML = `Temp: ${cardTemp}`;
    cardElement.appendChild(cardTempElement);

    let cardWind = Math.round(data.daily[i].wind_speed * 3.6),
      cardWindElement = document.createElement("p");
    cardWindElement.innerHTML = `Wind: ${cardWind} km/h`;
    cardElement.appendChild(cardWindElement);

    let cardHumidity = data.daily[i].humidity,
      cardHumidityElement = document.createElement("p");
    cardHumidityElement.innerHTML = `Humidity: ${cardHumidity}`;
    cardElement.appendChild(cardHumidityElement);
  }
};

const updateHistory = (currentCity) => {
  let cities = localStorage.getItem(localStorageKey) || "";
  if (!cities.length) {
    cities += currentCity;
    createSearchButton(currentCity);
  } else {
    if (!cities.includes(currentCity)) {
      cities += `,${currentCity}`;
      createSearchButton(currentCity);
    }
  }
  localStorage.setItem(localStorageKey, cities);
};

const onClickHandler = async (evt) => {
  let city = "";
  if (evt.target.value != "") {
    city = evt.target.value;
  } else {
    city = document.querySelector(".cityNameInput").value;
  }
  const { weatherApi, countryName, currentCity } = await cityCall(city);
  const weatherUpdates = await weatherUpdate(weatherApi);
  updateHistory(currentCity);
  showWeather(weatherUpdates, countryName, currentCity);
};

searchButton.addEventListener("click", onClickHandler);

allButtons.addEventListener("click", onClickHandler);

window.onload = async () => {
  let previousCityNames = localStorage.getItem(localStorageKey) || "";
  if (previousCityNames.length) {
    previousCityNames = previousCityNames.split(",");
    for (let i = 0; i < previousCityNames.length; i++) {
      createSearchButton(previousCityNames[i]);
    }
    const { weatherApi, countryName, currentCity } = await cityCall(
      previousCityNames[0]
    );
    const weatherUpdates = await weatherUpdate(weatherApi);
    showWeather(weatherUpdates, countryName, currentCity);
  }
};
