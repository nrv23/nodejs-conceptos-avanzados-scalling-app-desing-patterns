const Phone = require("./phone");
const WeatherStation = require("./weatherStation");
const Web = require("./web");


// Create a weather station (the subject)
const weatherStation = new WeatherStation();

// Create some observers (phone and dashboard)
const phoneDisplay = new Phone("123");
const webDashboard = new Web("3456");

console.log({
    phoneDisplay,
    webDashboard
})

// Subscribe the observers to the weather station
weatherStation.addObserver(phoneDisplay);
weatherStation.addObserver(webDashboard);

weatherStation.removeObserver("3456");
// Change the temperature (this will notify all observers)
weatherStation.setTemperature(25); // Both observers will get notified
weatherStation.setTemperature(30); // Both observers will get notified again
