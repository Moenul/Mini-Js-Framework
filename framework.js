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
        this.$el = document.querySelector(options.el);
        this.data = {};

        // Create reactivity for each property in the data object
        for (let key in options.data) {
            this.data[key] = new Reactive(options.data[key]);
        }

        // Subscribe only ONCE
        this.render();
        for (let key in this.data) {
            this.data[key].subscribe(() => this.updateUI(key));
        }
    }

    render() {
        this.template = this.$el.innerHTML; // Store the original template
        this.updateUI();
    }

    updateUI(key = null) {
        if (key) {
            // Update only the changed value
            this.$el.innerHTML = this.template.replace(
                /\{\{(.*?)\}\}/g,
                (_, match) => this.data[match.trim()]?.value || ""
            );
        } else {
            // First render
            this.$el.innerHTML = this.template.replace(
                /\{\{(.*?)\}\}/g,
                (_, match) => this.data[match.trim()]?.value || ""
            );
        }
    }
}
