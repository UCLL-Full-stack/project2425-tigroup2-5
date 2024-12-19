import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi, { serve } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Request, Response, NextFunction } from 'express';
import employeeRouter from './controller/employee.routes';
import employmentRouter from './controller/employment.routes';
import personRouter from './controller/person.routes';
import memberRouter from './controller/member.routes';
import regionRouter from './controller/region.routes';
import subscriptionRouter from './controller/subscription.routes';
import clubRouter from './controller/club.routes';
import enrollmentRouter from './controller/enrollment.routes';
import { tr } from 'date-fns/locale';

const app = express();
const port = process.env.APP_PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use('/person', personRouter);
app.use('/member', memberRouter);
app.use('/region', regionRouter);
app.use('/subscription', subscriptionRouter);
app.use('/club', clubRouter);
app.use('/enrollment', enrollmentRouter);
app.use('/employment', employmentRouter);
app.use('/employee', employeeRouter);


const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Subscription API',
            version: '1.0.0',
            description: 'A simple Express API for managing subscriptions',
        },
    },
    apis: ['./controller/*.routes.ts'],
};

try {
    const swaggerSpec = swaggerJSDoc(swaggerOpts);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (error) {
    console.log(error);
}

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    res.status(400).json({
        status: 'application error',
        message: err.message,
    });
});