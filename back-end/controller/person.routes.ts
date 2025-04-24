import personService from "../service/person.service";
import express, { NextFunction, Request, Response } from 'express';

const personRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Person:
 *          type: object
 *          required:
 *              - id
 *              - firstname
 *              - surname
 *              - email
 *              - phone
 *              - birthDate
 *          properties:
 *              id:
 *                  type: number
 *                  description: The person's ID
 *              firstname:
 *                  type: string
 *                  description: The person's first name
 *              surname:
 *                  type: string
 *                  description: The person's surname
 *              email:
 *                  type: string
 *                  description: The person's email
 *              phone:
 *                  type: string
 *                  description: The person's phone
 *              birthDate:
 *                  type: string
 *                  format: date
 *                  description: The person's birth date
 *          example:
 *              id: 1
 *              firstname: Jane
 *              surname: Smith
 *              email: jane.smith@mail.com
 *              phone: 987654321
 *              birthDate: 1990-01-01
 * 
 * tags:
 *  name: Person
 *  description: The person managing API
 *
 * /person:
 *  get:
 *      summary: Get all persons
 *      tags: [Person]
 *      responses:
 *          200:
 *              description: A list of persons
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Person'
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
 * /person/{nrn}:
 *  get:
 *      summary: Get a person by NRN
 *      tags: [Person]
 *      parameters:
 *          - in: path
 *            name: nrn
 *            schema:
 *              type: string
 *            required: true
 *            description: The person's NRN
 *      responses:
 *          200:
 *              description: A person by NRN
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Person'
 *          404:
 *              description: The person was not found
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