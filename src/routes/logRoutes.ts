import { Router } from "express";
import type { Request, Response } from "express";
import logController from "../controllers/logController.ts";

const route = Router()

route.post('/logs/:id', logController.markAsCompletedHabit)

export default route