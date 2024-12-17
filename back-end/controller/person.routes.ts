import { Router } from "express";
import personService from "../service/person.service";

const personRouter = Router();

personRouter.get("/", async (req, res) => {
    try {
        const persons = await personService.getAllPersons();
        res.json(persons);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

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