import mongoose from "mongoose"

export const connectDB = (url: string): void => {
    mongoose.connect(url)
        .then(() => console.log("Connected to MongoDB..."))
        .catch(() => console.log("Error connecting to MongoDB"))
}