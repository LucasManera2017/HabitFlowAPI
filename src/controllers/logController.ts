import type { Request, Response } from "express";
import logServices from "../services/logService.ts";

const logController = {
    markCompletedHabit: async(req: Request, res: Response) => {
        try{
            if (!req.params.id){
                return res.status(400).json({
                    message: "Missing param habitId"
                })
            }
            const markedAsCompletedHabit = await logServices.markCompletedHabit(req.params.id)
            if(markedAsCompletedHabit){
                return res.status(200).json({
                message: "Habit marked as completed"
            })
            }
            return res.status(400).json({
                message: "Habit already marked as completed"
            })
        }catch(err){
            return res.status(500).json({
                message: ("") + err
            })
        }
    }
}

export default logController