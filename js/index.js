var searchButton = document.querySelector("#searchButtonId");
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

function setIcons(icon, iconIDsky) {
  if (icon == "SNOW") var skycons = new Skycons({ color: "white" });
  else var skycons = new Skycons({ color: "white" });
  skycons.play();
  return skycons.set(iconIDsky, Skycons[icon]);
}

function covertToHumanDate(unixTimestamp) {
  const milliseconds = unixTimestamp * 1000; // 1575909015000
  const dateObject = new Date(milliseconds);
  const humanDateFormat = dateObject.toLocaleString(); //2019-12-9 10:30:15
  const humanDate = humanDateFormat.split(",")[0];
  return humanDate;
}

function convertIcons(weatherDesc) {
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
}

searchButton.addEventListener("click", () => {
  console.log(document.querySelector(".cityNameInput").value);
  currentCity = document.querySelector(".cityNameInput").value;
  cityCoordinatesApi = `http://api.openweathermap.org/geo/1.0/direct?q=${currentCity}&limit=1&appid=${apiKey}`;
  // getting the geo coordinates based on the city name
  fetch(cityCoordinatesApi)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      currentCityLat = data[0].lat;
      currentCityLong = data[0].lon;
      countryName = data[0].country;
      currentCity = data[0].name;
      console.log("------_XXXX-------");
      console.log(currentCityLat, currentCityLong, countryName, currentCity);

      weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCityLat}&lon=${currentCityLong}&units=metric&exclude=minutely,hourly&appid=${apiKey}`;
      fetch(weatherApi)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          //get human readable Datetime
          let unixTimestamp = data.current.dt;
          let humanDate = covertToHumanDate(unixTimestamp);
          // console.log(humanDateFormat, "XXXX", humanDate);

          currentCityAndDateTitle.innerText = `${currentCity}, ${countryName} ${humanDate}`;
          currentCityTemp.innerText = `Temp: ${data.current.temp} °C`;
          currentCityWind.innerText = `Wind: ${Math.round(
            data.current.wind_speed * 3.6
          )} km/h`;
          currentCityHumidity.innerText = `Humidity: ${data.current.humidity} %`;
          currentCityUv.innerText = `UV Index: ${data.current.uvi}`;
          var icon = convertIcons(data.current.weather[0].main);
          setIcons(icon, document.querySelector(".icon"));

          for (var i = 1; i <= 5; i++) {
            let cardDate = covertToHumanDate(data.daily[i].dt);
            const cardDateElement = document.createElement("p");
            cardDateElement.innerHTML = cardDate;
            let card = `.card` + i;
            let cardElement = document.querySelector(`${card}`);
            cardElement.appendChild(cardDateElement);

            let cardIcon = convertIcons(data.daily[i].weather[0].main);
            const cardIconElement = document.createElement("canvas");
            cardIconElement.width = "30";
            cardIconElement.height = "30";
            cardIconElement.className = "cardIcon" + i;
            cardElement.appendChild(cardIconElement);
            setIcons(cardIcon, document.querySelector(`.cardIcon${i}`));

            let cardTemp = data.daily[i].temp.day;
            const cardTempElement = document.createElement("p");
            cardTempElement.innerHTML = `Temp: ${cardTemp}`;
            cardElement.appendChild(cardTempElement);

            let cardWind = Math.round(data.daily[i].wind_speed * 3.6);
            const cardWindElement = document.createElement("p");
            cardWindElement.innerHTML = `Wind: ${cardWind} km/h`;
            cardElement.appendChild(cardWindElement);

            let cardHumidity = data.daily[i].humidity;
            const cardHumidityElement = document.createElement("p");
            cardHumidityElement.innerHTML = `Humidity: ${cardHumidity}`;
            cardElement.appendChild(cardHumidityElement);
            console.log(`-------[${i}]---------`);
            console.log(cardDate, cardTemp, cardWind, cardHumidity);
          }
        });
    });
});
