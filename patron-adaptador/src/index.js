const localStorage = require("./clasess/localStorage");


console.log("Number of items in localStorage: ", localStorage.length);

const theme = localStorage.getItem("theme");

console.log("theme_mode: ", theme);

if (!theme) {
  console.log("Theme mode not selected. Assigning a default mode...");
  localStorage.setItem("theme_mode", "light");
  localStorage.setItem("setting_code", "5");
}


console.log("Number of items in localStorage: ", localStorage.length);

const themeMode = localStorage.getItem("theme_mode");
localStorage.setItem("setting_code","32343242343");
const settingCode = localStorage.getItem("setting_code");

console.log("theme_mode: ", themeMode);
console.log("setting_code: ", settingCode);

localStorage.removeItem("theme_mode");
localStorage.removeItem("setting_code");

console.log("Number of items in localStorage: ", localStorage.length);