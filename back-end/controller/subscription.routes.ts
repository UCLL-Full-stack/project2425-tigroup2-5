import subscriptionService from '../service/subscription.service';
import { SubscriptionInput } from '../types';
import express, { NextFunction, Request, Response } from 'express';

const subscriptionRouter = express.Router();

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get a list of all subscriptions.
 *     description: Get a list of all subscriptions.
 *     responses:
 *       200:
 *         description: A JSON array of subscriptions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 */
subscriptionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        next(error);
    }
});

subscriptionRouter.post('/', async (req, res) => {
    try {
        const subscription = <SubscriptionInput>req.body;
        const result = await subscriptionService.createSubscription(subscription);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ status: error, errorMessage: (error as Error).message });
        
    }
});

subscriptionRouter.get('/:id', async (req, res) => {
    try {
        const subscription = await subscriptionService.getSubscriptionById(Number(req.params.id));
        if (subscription === undefined) {
            res.status(404).send(`Subscription with id ${req.params.id} not found`);
        } else {
            res.status(200).json(subscription);
        }
    } catch (error) {
        res.status(400).json({ status: error, errorMessage: (error as Error).message });
        
    }
});

export default subscriptionRouter;