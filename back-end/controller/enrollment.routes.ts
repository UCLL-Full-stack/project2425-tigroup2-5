import express, { NextFunction, Request, Response } from 'express';
import enrollmentService from "../service/enrollment.service";
import subscriptionService from '../service/subscription.service';
import memberService from '../service/member.service';
import clubService from '../service/club.service';
import regionService from '../service/region.service';

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
 *  post:
 *      summary: Create a new enrollment
 *      tags: [Enrollment]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - memberId
 *                          - subscriptionId
 *                          - enrollmentDate
 *                          - expirationDate
 *                      properties:
 *                          memberId:
 *                              type: integer
 *                              description: The ID of the member
 *                          subscriptionId:
 *                              type: integer
 *                              description: The ID of the subscription
 *                          clubId:
 *                              type: integer
 *                              description: The ID of the club (required for club subscriptions)
 *                          regionId:
 *                              type: integer
 *                              description: The ID of the region (required for regional subscriptions)
 *                          enrollmentDate:
 *                              type: string
 *                              format: date-time
 *                              description: The start date of the enrollment
 *                          expirationDate:
 *                              type: string
 *                              format: date-time
 *                              description: The expiration date of the enrollment
 *      responses:
 *          201:
 *              description: Enrollment created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Enrollment'
 *          400:
 *              description: Invalid input data
 *          500:
 *              description: Server error
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

/**
 * @swagger
 * /enrollment:
 *  post:
 *      summary: Create a new enrollment
 *      tags: [Enrollment]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - memberId
 *                          - subscriptionId
 *                          - enrollmentDate
 *                          - expirationDate
 *                      properties:
 *                          memberId:
 *                              type: integer
 *                              description: The ID of the member
 *                          subscriptionId:
 *                              type: integer
 *                              description: The ID of the subscription
 *                          clubId:
 *                              type: integer
 *                              description: The ID of the club (required for club subscriptions)
 *                          regionId:
 *                              type: integer
 *                              description: The ID of the region (required for regional subscriptions)
 *                          enrollmentDate:
 *                              type: string
 *                              format: date-time
 *                              description: The start date of the enrollment
 *                          expirationDate:
 *                              type: string
 *                              format: date-time
 *                              description: The expiration date of the enrollment
 *      responses:
 *          201:
 *              description: Enrollment created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Enrollment'
 *          400:
 *              description: Invalid input data
 *          500:
 *              description: Server error
 */

enrollmentRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            memberId, 
            subscriptionId, 
            clubId, 
            regionId, 
            enrollmentDate, 
            expirationDate 
        } = req.body;
        
        if (!memberId || !subscriptionId) {
            return res.status(400).json({ 
                message: "MemberId and subscriptionId are required" 
            });
        }
        
        const subscription = await subscriptionService.getSubscriptionById(Number(subscriptionId));
        if (!subscription) {
            return res.status(400).json({ message: "Invalid subscriptionId" });
        }

        const member = await memberService.getMemberById(Number(memberId));
        if (!member) {
            return res.status(400).json({ message: "Invalid memberId" });
        }

        // Check club ID if provided
        let club = undefined;
        if (clubId) {
            club = await clubService.getClubById(Number(clubId));
            if (!club) {
                return res.status(400).json({ message: "Invalid clubId" });
            }
        }

        // Check region ID if provided
        let region = undefined;
        if (regionId) {
            region = await regionService.getRegionById(Number(regionId));
            if (!region) {
                return res.status(400).json({ message: "Invalid regionId" });
            }
        }

        // Validate subscription type with provided IDs
        if (subscription.type === "Club" && !clubId) {
            return res.status(400).json({ message: "Club subscription requires a clubId" });
        }
        
        if (subscription.type === "Regional" && !regionId) {
            return res.status(400).json({ message: "Regional subscription requires a regionId" });
        }

        // Parse dates if provided
        const enrollmentStartDate = enrollmentDate ? new Date(enrollmentDate) : undefined;
        const enrollmentEndDate = expirationDate ? new Date(expirationDate) : undefined;

        // Create enrollment data object
        const enrollmentData = {
            member,
            subscription,
            club,
            region,
            enrollmentDate: enrollmentStartDate,
            expirationDate: enrollmentEndDate
        };
        
        const newEnrollment = await enrollmentService.createEnrollment(enrollmentData);
        res.status(201).json(newEnrollment);
    } catch (error) {
        next(error);
    }
});

export default enrollmentRouter;