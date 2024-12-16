import { Router } from 'express';
import subscriptionService from '../service/subscription.service';
import { subscriptionInput } from '../types';

const subscriptionRouter = Router();

subscriptionRouter.get('/', async (req, res) => {
    try {
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: error, errorMessage: error.message });
        } else {
            res.status(400).json({ status: 'unknown error', errorMessage: 'An unknown error occurred' });
        }
    }
});

subscriptionRouter.post('/', async (req, res) => {
    try {
        const subscription = <subscriptionInput>req.body;
        const result = await subscriptionService.createSubscription(subscription);
        res.status(200).json(subscription);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: error, errorMessage: error.message });
        } else {
            res.status(400).json({ status: 'unknown error', errorMessage: 'An unknown error occurred' });
        }
    }
});