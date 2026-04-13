/*
Short Homework Guide (Observer Pattern in Node.js)

1. Intro to the Observer Pattern  
   - An Observer pattern involves a subject (or “observable”) that keeps a list of observers who want to be notified whenever the subject’s state changes.  
   - In this example, the “weather station” is the subject, and the “phone” and “web dashboard” are observers.

2. Review the “Before” Code  
   - You have a `weatherStation` variable, but it might not have the full logic for adding/removing observers or notifying them.
   - Observers (`Phone`, `Web`) each have an `update(...)` method, but the code may not be set up in a consistent “Subject–Observer” structure.

3. the desired Code  
   - A new file `weather-station.js` contains:
     - A constructor with `this.observers = []`.
     - `addObserver(...)` to subscribe an observer.
     - `removeObserver(...)` to unsubscribe it.
     - `notifyObservers()` that calls `observer.update(...)` for each observer.
     - `setTemperature(...)` changes the state and then calls `notifyObservers()`.
   - `index.js` simply creates the `WeatherStation`, then adds observers (`phoneDisplay`, `webDashboard`).

4. Homework Steps  
   1. Create a `WeatherStation` class (or rename your current code) with:
      - An array (or list) of observers.
      - Methods `addObserver(observer)`, `removeObserver(observer)`, `notifyObservers()`.
      - A `setTemperature(temp)` that changes the “temperature” state and calls `notifyObservers()`.
   2. Make the `Phone` and `Web` classes each have an `update(...)` method to handle the new temperature.
   3. In `index.js`, instantiate `WeatherStation`, create `Phone` and `Web` objects, and call `weatherStation.addObserver(...)`.
   4. Trigger a temperature change (e.g. `weatherStation.setTemperature(25)`) so that each observer’s `update(...)` method is called.
   5. Optional: implement `removeObserver(...)` if you want to test unsubscribing.

5. Test and Check  
   - When you call `weatherStation.setTemperature(...)`, both `Phone` and `Web` should log messages with the new temperature.  
   - The logic for notifying all observers should be in `notifyObservers()`.  
   - Confirm no changes are needed in `Phone` and `Web` aside from making sure they have an `update` method.

*/
