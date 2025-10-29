import express from "express";
import morgan from 'morgan'
import cors from 'cors'

export const app = express();


app.use(express.json());
app.use(cors())
app.use(morgan('dev'))


app.get("/", (req, res) => {
    res.send("Hello from server!")
});

