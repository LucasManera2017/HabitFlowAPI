import express from "express";
import morgan from 'morgan'
import cors from 'cors'
import route from "./routes/habitRoutes.ts";

export const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan('dev'))
app.use('/api', route)
