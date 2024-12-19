import personService from "../service/person.service";
import express, { NextFunction, Request, Response } from 'express';

const personRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   Person:
 *    type: object
 *   properties:
 *    nrn:
 *     type: string
 *     description: The NRN of the person
 *    firstName:
 *     type: string
 *     description: The first name of the person
 *    lastName:
 *     type: string
 *     description: The last name of the person
 *    birthDate:
 *     type: string
 *     format: date
 *     description: The birth date of the person
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of persons
 *     responses:
 *       200:
 *         description: A list of persons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *       500:
 *         description: Internal server error
 */
personRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lecturers = await personService.getAllPersons();
        res.status(200).json(lecturers);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /{nrn}:
 *   get:
 *     summary: Retrieve a person by NRN
 *     parameters:
 *       - in: path
 *         name: nrn
 *         required: true
 *         schema:
 *           type: string
 *         description: The NRN of the person to retrieve
 *     responses:
 *       200:
 *         description: A person object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       404:
 *         description: Person not found
 *       500:
 *         description: Internal server error
 */
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