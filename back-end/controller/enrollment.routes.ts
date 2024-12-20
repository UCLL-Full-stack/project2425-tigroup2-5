import express, { NextFunction, Request, Response } from 'express';
import enrollmentService from "../service/enrollment.service";

const enrollmentRouter = express.Router();

enrollmentRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await enrollmentService.getAllEnrollments();
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
});

enrollmentRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const enrollment = await enrollmentService.getEnrollmentById(id);
        res.status(200).json(enrollment);
    } catch (error) {
        next(error);
    }
});

export default enrollmentRouter;