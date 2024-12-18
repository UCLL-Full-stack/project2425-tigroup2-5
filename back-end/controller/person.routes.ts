import { Router } from "express";
import personService from "../service/person.service";

const personRouter = Router();

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
personRouter.get("/", async (req, res) => {
    try {
        const persons = await personService.getAllPersons();
        res.json(persons);
    } catch (error) {
        res.status(500).send((error as Error).message);
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
personRouter.get("/:nrn", async (req, res) => {
    try {
        const person = await personService.getPersonByNrn(req.params.nrn);
        if (person === undefined) {
            res.status(404).send(`Person with nrn ${req.params.nrn} not found`);
        } else {
            res.json(person);
        }
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

export default personRouter;