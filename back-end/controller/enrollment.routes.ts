import enrollmentService from "../service/enrollment.service";
import express, { NextFunction, Request, Response } from 'express';

const enrollmentRouter = express.Router();

enrollmentRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await enrollmentService.getAllEnrollments();
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
});

export default enrollmentRouter;