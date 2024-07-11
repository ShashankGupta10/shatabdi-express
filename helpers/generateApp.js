const generateApp = (orm, language) => {
    return `${language === "TypeScript" ? "import express from 'express';\nconst app = express();\nimport indexRouter from './routes/index';\nimport { config } from 'dotenv';\nconfig()" :
        "const express = require('express');\nconst indexRouter = require('./routes/index');\nconst app = express();\nconst dotenv = require('dotenv');\ndotenv.config()"}
        ${orm === "Mongoose" ? `${language === "Typescript" ? "import { connectDB } from './db/connect';" : "const { connectDB } = require('./db/connect');"}` : ""}

app.use(express.json());
app.use('/api', indexRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, ${orm === "Mongoose" ? "async " : ""}() => {
    ${orm === "Mongoose" ? "await connectDB(process.env.DATABASE_URL)" : ""}
    console.log(\`Server is running on port \${PORT}\ \`);
});

`}

module.exports = {
    generateApp
}