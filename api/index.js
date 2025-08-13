import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import TaskRouter from './Routes/Task.route.js';


dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(cors({
    origin: '*'
}))

// Importing Task routes

app.use('/api/task', TaskRouter)
app.use('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Task Management API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                max-width: 500px;
                width: 90%;
            }
            h1 {
                margin-bottom: 10px;
                font-size: 2rem;
            }
            p {
                font-size: 1.1rem;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Task Management API</h1>
            <p>Welcome! Use our API to manage your tasks easily.</p>
        </div>
    </body>
    </html>
    `);
});


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});