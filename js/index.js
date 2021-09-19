var searchButton = document.querySelector("#searchButtonId");
let currentCity;

let currentCityAndDateTitle = document.querySelector("#cityCurrentAndDate");
let currentCityTemp = document.querySelector(".temp");

const apiKey = "47f166773e351368285402b79068ea73";

let api = "";

searchButton.addEventListener("click", () => {
  console.log(document.querySelector(".cityNameInput").value);
  currentCity = document.querySelector(".cityNameInput").value;
  api = `http://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&units=metric&appid=${apiKey}`;
  console.log(api);
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.city.name);
      console.log(data.city.country);
      console.log(data.list[0].dt_txt);
      console.log(data.list[0].main.temp);
      currentCityAndDateTitle.innerText = `${data.city.name}, ${data.city.country} `;
      currentCityTemp.innerText = `Temp: ${data.list[0].main.temp}`;
    });
});
