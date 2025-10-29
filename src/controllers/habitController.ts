import { app } from "../app.ts";
import type { Request, Response } from "express";


export const habitController = async (req: Request, res: Response) => {
    
    
    res.send("All habits")
};