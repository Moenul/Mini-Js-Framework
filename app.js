const app = new MiniFramework({
    el: "#app",
    data: {
        message: "Hello, Mini Framework!",
    },
});

function updateMessage() {
    app.data.message.value = "You clicked the button!";
}
