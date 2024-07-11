const mongooose = require("mongoose")

const connectDB = (url) => {
    mongooose.connect(url)
        .then(() => console.log("Connected to MongoDB..."))
        .catch(() => console.log("Error connecting to MongoDB"))
}

module.exports = {
    connectDB
}