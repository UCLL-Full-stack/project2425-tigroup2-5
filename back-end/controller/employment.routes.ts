import employmentService from "../service/employment.service";
import express, { NextFunction, Request, Response } from 'express';

const employmentRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Employment:
 *          type: object
 *          required:
 *              - startDate
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the employment
 *              startDate:
 *                  type: string
 *                  format: date
 *                  description: The start date of the employment
 *              endDate:
 *                  type: string
 *                  format: date
 *                  nullable: true
 *                  description: The end date of the employment
 *              employee:
 *                  type: object
 *                  nullable: true
 *                  description: The employee associated with the employment
 *              club:
 *                  type: object
 *                  nullable: true
 *                  description: The club associated with the employment
 *          example:
 *              id: 1
 *              startDate: "2023-01-01"
 *              endDate: "2023-12-31"
 *              employee: null
 *              club: null
 *
 * tags:
 *  name: Employment
 *  description: The employments managing API
 * 
 * /employment:
 *  get:
 *      summary: Get all employments
 *      tags: [Employment]
 *      responses:
 *          200:
 *              description: A list of employments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Employment'
 */

employmentRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employments = await employmentService.getAllEmployments();
        res.status(200).json(employments);
    } catch (error) {
        next(error);
    }
});

export default employmentRouter;