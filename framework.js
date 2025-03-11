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
        this.template = this.$el.innerHTML; // Store original template

        // Create reactive properties
        for (let key in options.data) {
            this.data[key] = new Reactive(options.data[key]);

            // Subscribe to UI updates
            this.data[key].subscribe(() => this.updateUI());
        }

        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Bind input fields for two-way data binding
        this.$el.querySelectorAll("input").forEach((input) => {
            const key = input.getAttribute("data-model");
            if (key && this.data[key]) {
                input.value = this.data[key].value;

                // Update state when user types
                input.addEventListener("input", (event) => {
                    this.data[key].value = event.target.value;
                });
            }
        });

        // Bind button clicks
        this.$el.querySelectorAll("[data-action]").forEach((button) => {
            const action = button.getAttribute("data-action");
            if (action && typeof window[action] === "function") {
                button.addEventListener("click", window[action]);
            }
        });
    }

    updateUI() {
        // Replace {{ message }} inside elements
        this.$el.innerHTML = this.template.replace(
            /\{\{(.*?)\}\}/g,
            (_, match) => {
                return this.data[match.trim()]?.value || "";
            }
        );

        // Re-bind inputs and buttons after re-rendering
        this.bindEvents();
    }
}
