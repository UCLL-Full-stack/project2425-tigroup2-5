import { Router } from "express";
import clubService from "../service/club.service";

const clubRouter = Router();

clubRouter.get("/", async (req, res) => {
    try {
        const clubs = await clubService.getAllClubs();
        res.json(clubs);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

clubRouter.get("/:id", async (req, res) => {
    try {
        const club = await clubService.getClubById(Number(req.params.id));
        if (club === undefined) {
            res.status(404).send(`Club with id ${req.params.id} not found`);
        } else {
            res.json(club);
        }
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

export default clubRouter;