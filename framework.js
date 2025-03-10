class Reactive {
    constructor(data) {
        this._data = data;
        this.subscribers = new Set();
    }

    get value() {
        return this._data;
    }

    set value(newValue) {
        this._data = newValue;
        this.notify();
    }

    subscribe(callback) {
        this.subscribers.add(callback);
    }

    notify() {
        this.subscribers.forEach((callback) => callback(this._data));
    }
}
