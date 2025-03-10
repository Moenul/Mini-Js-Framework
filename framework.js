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

class MiniFramework {
    constructor(options) {
        this.$el = document.querySelector(options);
        this.data = {};

        for (let key in options.data) {
            this.data[key] = new Reactive(options.data[key]);
        }

        this.render;
    }

    render() {
        this.$el.innerHTML = this.$el.innerHTML.replace(
            /\{\{(.*?)\}\}/g,
            (_, key) => this.data[key.trim()].value
        );

        // Subscribe to changes so UI updates automatically
        for (let key in this.data) {
            this.data[key].subscribe(() => this.render());
        }
    }
}
