import express from 'express';
const app = express();
import indexRouter from './routes/index';
import { config } from 'dotenv';
config()
        

app.use(express.json());
app.use('/api', indexRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    
    console.log(`Server is running on port ${PORT} `);
});

