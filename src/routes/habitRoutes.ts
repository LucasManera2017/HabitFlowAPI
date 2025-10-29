import { Router } from "express";
import { habitController } from '../controllers/habitController.ts'

const route = Router()

route.get('/habits', habitController)

export default route