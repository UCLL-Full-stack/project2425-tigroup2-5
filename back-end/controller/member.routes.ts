import express, { NextFunction, Request, Response } from 'express';
import memberService from "../service/member.service";
import enrollmentService from "../service/enrollment.service";
import subscriptionService from "../service/subscription.service";
import { authenticate, isAdmin, isOwnerOrAdmin } from '../middleware/auth.middleware';

const memberRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Member:
 *          type: object
 *          required:
 *              - password
 *              - person
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the member
 *              password:
 *                  type: string
 *                  description: The password of the member
 *              person:
 *                  $ref: '#/components/schemas/Person'
 *          example:
 *              id: 1
 *              password: securepassword123
 *              person:
 *                  id: 1
 *                  name: John Doe
 *                  email: john.doe@mail.com
 *
 * tags:
 *  name: Member
 *  description: The members managing API
 * 
 * /member:
 *  get:
 *      summary: Get all members
 *      tags: [Member]
 *      responses:
 *          200:
 *              description: A list of members
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Member'
 */

// Protected route - only authenticated users can access all members
memberRouter.get('/', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const members = await memberService.getAllMembers();
        res.status(200).json(members);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /member/{id}:
 *  get:
 *      summary: Get a member by id
 *      tags: [Member]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the region
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: A member by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Member'
 *          404:
 *              description: Member not found
 */

// Protected route - only the member themselves or an admin can access a specific member
memberRouter.get("/:id", authenticate, isOwnerOrAdmin('id'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const member = await memberService.getMemberById(id);
        res.status(200).json(member);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /member/{id}/enrollments:
 *  get:
 *      summary: Get all enrollments for a specific member
 *      tags: [Member]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the member
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: A list of enrollments for the member
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Enrollment'
 *          404:
 *              description: Member not found
 */
memberRouter.get("/:id/enrollments", authenticate, isOwnerOrAdmin('id'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const memberId = parseInt(req.params.id);
        const enrollments = await enrollmentService.getEnrollmentsByMemberId(memberId);
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /member/{id}/subscriptions:
 *  get:
 *      summary: Get available subscriptions for a member
 *      tags: [Member]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the member
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: A list of available subscriptions
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Subscription'
 *          404:
 *              description: Member not found
 */
memberRouter.get("/:id/subscriptions", authenticate, isOwnerOrAdmin('id'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        // For now, we're just returning all available subscriptions
        // In a real app, you might filter based on member eligibility, location, etc.
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        next(error);
    }
});

export default memberRouter;