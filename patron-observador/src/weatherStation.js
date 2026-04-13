

class WeatherStation {

    #observers = [];
    #temperature = 0;

    constructor() {

    }

    addObserver(observer) {
        if (!observer) throw new Error("observer value is not valid");
        this.#observers.push(observer);

        console.log(this.#observers)
    }

    removeObserver(id) {

        this.#observers = this.#observers.filter(obs => obs.id !== id);
    }

    setTemperature(temperature) {
        this.#temperature = temperature;
        this.#notify();
    }

    #notify() {
        this.#observers.forEach(observer => observer.update(this.#temperature));
    }

}

module.exports = WeatherStation;