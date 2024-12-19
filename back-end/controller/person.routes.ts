import personService from "../service/person.service";
import express, { NextFunction, Request, Response } from 'express';

const personRouter = express.Router();


personRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lecturers = await personService.getAllPersons();
        res.status(200).json(lecturers);
    } catch (error) {
        next(error);
    }
});


personRouter.get('/:nrn', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nrn = req.params.nrn;
        const lecturer = await personService.getPersonByNrn(nrn);
        res.status(200).json(lecturer);
    } catch (error) {
        next(error);
    }
});

export default personRouter;