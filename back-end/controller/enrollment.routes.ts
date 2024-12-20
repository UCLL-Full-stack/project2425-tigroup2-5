import express, { NextFunction, Request, Response } from 'express';
import enrollmentService from "../service/enrollment.service";

const enrollmentRouter = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Enrollment:
 *          type: object
 *          required:
 *              - subscription
 *              - member
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the enrollment
 *              subscription:
 *                  $ref: '#/components/schemas/Subscription'
 *                  description: The subscription details
 *              member:
 *                  $ref: '#/components/schemas/Member'
 *                  description: The member details
 *              club:
 *                  $ref: '#/components/schemas/Club'
 *                  description: The club details
 *                  nullable: true
 *              region:
 *                  $ref: '#/components/schemas/Region'
 *                  description: The region details
 *                  nullable: true
 *          example:
 *              id: 1
 *              subscription:
 *                  id: 1
 *                  name: "Premium"
 *              member:
 *                  id: 101
 *                  name: "John Doe"
 *              club:
 *                  id: 10
 *                  name: "Fitness Club"
 *              region:
 *                  id: 5
 *                  name: "North Region"
 *
 * tags:
 *  name: Enrollment
 *  description: The enrollments managing API
 * 
 * /enrollment:
 *  get:
 *      summary: Get all enrollments
 *      tags: [Enrollment]
 *      responses:
 *          200:
 *              description: A list of enrollments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Enrollment'
 */

enrollmentRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await enrollmentService.getAllEnrollments();
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /enrollment/{id}:
 *  get:
 *      summary: Get an enrollment by id
 *      tags: [Enrollment]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the enrollment
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: An enrollment object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Enrollment'
 *          404:
 *              description: The enrollment was not found
 */

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