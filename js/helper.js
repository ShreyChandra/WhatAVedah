// // import { setIcons, covertToHumanDate, convertIcons } from "./helper.js";
// export const setIcons = (icon, iconIDsky) => {
//   let skycons = new Skycons({ color: "white" });
//   skycons.play();
//   return skycons.set(iconIDsky, Skycons[icon]);
// };

// export const covertToHumanDate = (unixTimestamp) => {
//   const milliseconds = unixTimestamp * 1000; // 1575909015000
//   const dateObject = new Date(milliseconds);
//   const humanDateFormat = dateObject.toLocaleString(); //2019-12-9 10:30:15
//   const humanDate = humanDateFormat.split(",")[0];
//   return humanDate;
// };

// export const convertIcons = (weatherDesc) => {
//   switch (weatherDesc) {
//     case "Clouds":
//       return "CLOUDY";
//     case "Rain":
//       return "RAIN";
//     case "Thunderstorm":
//       return "WIND";
//     case "Mist":
//       return "FOG";
//     case "Clear":
//       return "CLEAR_DAY";
//   }
// };

// // export default setIcons;
// // export default covertToHumanDate;
// // export default convertIcons;
