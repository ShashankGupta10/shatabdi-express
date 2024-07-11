const express = require('express');
const indexRouter = require('./routes/index');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
        const { connectDB } = require('./db/connect');

app.use(express.json());
app.use('/api', indexRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectDB(process.env.DATABASE_URL)
    console.log(`Server is running on port ${PORT} `);
});

