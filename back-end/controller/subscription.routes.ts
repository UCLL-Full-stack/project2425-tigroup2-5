import { Router } from 'express';
import subscriptionService from '../service/subscription.service';
import { SubscriptionInput } from '../types';

const subscriptionRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management
 */

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Retrieve a list of subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: A list of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 */


subscriptionRouter.get('/', async (req, res) => {
    try {
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(400).json({ status: error, errorMessage: (error as Error).message });
        
    }
});

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionInput'
 *     responses:
 *       200:
 *         description: The created subscription
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 */

subscriptionRouter.post('/', async (req, res) => {
    try {
        const subscription = <SubscriptionInput>req.body;
        const result = await subscriptionService.createSubscription(subscription);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ status: error, errorMessage: (error as Error).message });
        
    }
});
/**
 * @swagger
 * /subscriptions/{id}:
 *   get:
 *     summary: Get a subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The subscription ID
 *     responses:
 *       200:
 *         description: The subscription data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 */
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