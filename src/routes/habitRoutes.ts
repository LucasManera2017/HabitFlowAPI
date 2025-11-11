import { Router } from "express";
import { habitController } from '../controllers/habitController.ts'

const route = Router()

route.get('/habits', habitController.getAllHabits)
route.get('/habits/:id', habitController.getHabitById)
route.get('/habits/:id/streak', habitController.getStreak)
route.post('/habits', habitController.createHabit)
route.put('/habits/:id', habitController.updateHabit)
route.delete('/habits/:id', habitController.deleteHabit)


export default route