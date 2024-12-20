import subscriptionService from '../service/subscription.service';
import express, { NextFunction, Request, Response } from 'express';

const subscriptionRouter = express.Router();

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