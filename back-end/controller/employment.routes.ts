import employmentService from "../service/employment.service";
import express, { NextFunction, Request, Response } from 'express';

const employmentRouter = express.Router();

employmentRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employments = await employmentService.getAllEmployments();
        res.status(200).json(employments);
    } catch (error) {
        next(error);
    }
});

export default employmentRouter;