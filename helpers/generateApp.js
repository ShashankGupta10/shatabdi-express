const generateApp = (orm, language) => {
    return `${language === "TypeScript" ? "import express from 'express';\nconst app = express();\nimport authRouter from './routes/auth';\nimport { config } from 'dotenv';\nconfig()" :
        "const express = require('express');\nconst authRouter = require('./routes/auth');\nconst app = express();\nconst dotenv = require('dotenv');\ndotenv.config()"}
        ${orm === "Mongoose" ? `${language === "Typescript" ? "import { connectDB } from './db/connect';" : "const { connectDB } = require('./db/connect');"}` : ""}

app.use(express.json());
app.use('/api', authRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, ${orm === "Mongoose" ? "async " : ""}() => {
    ${orm === "Mongoose" ? "await connectDB(process.env.DATABASE_URL)" : ""}
    console.log(\`Server is running on port \${PORT}\ \`);
});

`}

module.exports = {
    generateApp
}