import express from "express";
import morgan from 'morgan'
import cors from 'cors'
import habitRoute from "./routes/habitRoutes.ts";
import logRoute from './routes/logRoutes.ts'

export const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan('dev'))
app.use('/api', habitRoute)
app.use('/api', logRoute)
