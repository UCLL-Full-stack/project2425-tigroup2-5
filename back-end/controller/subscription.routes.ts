import subscriptionService from '../service/subscription.service';
import express, { NextFunction, Request, Response } from 'express';

const subscriptionRouter = express.Router();


/**
 * @swagger
 * components:
 *  schemas:
 *      Subscription:
 *          type: object
 *          required:
 *              - id
 *              - type
 *              - price
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The subscription ID
 *              type:
 *                  type: string
 *                  description: The subscription type
 *              price:
 *                  type: number
 *                  description: The subscription price
 *          example:
 *              id: 1
 *              type: "premium"
 *              price: 9.99
 * 
 * tags:
 *  name: Subscription
 *  description: The subscription managing API
 *
 * /subscription:
 *  get:
 *      summary: Get all subscriptions
 *      tags: [Subscription]
 *      responses:
 *          200:
 *              description: A list of subscriptions
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Subscription'
 */


subscriptionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        next(error);
    }
});

// subscriptionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const subscriptionInput: SubscriptionInput = req.body;
//         const newSubscription = await subscriptionService.createSubscription(subscriptionInput);
//         res.status(201).json(newSubscription);
//     } catch (error) {
//         next(error);
//     }
// });

/**
 * @swagger
 * /subscription/{id}:
 *  get:
 *      summary: Get a subscription by ID
 *      tags: [Subscription]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The subscription ID
 *      responses:
 *          200:
 *              description: A subscription by ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Subscription'
 *          404:
 *              description: The subscription was not found
 */

subscriptionRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const subscription = await subscriptionService.getSubscriptionById(id);
        res.status(200).json(subscription);
    } catch (error) {
        next(error);
    }
});

export default subscriptionRouter;