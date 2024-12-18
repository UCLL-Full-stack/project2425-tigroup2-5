import { Router } from "express";
import enrollmentService from "../service/enrollment.service";

const enrollmentRouter = Router();
/**
 * @swagger
 */
enrollmentRouter.get("/", async (req, res) => {
    try {
        const enrollments = await enrollmentService.getAllEnrollments();
        res.json(enrollments);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

export default enrollmentRouter;