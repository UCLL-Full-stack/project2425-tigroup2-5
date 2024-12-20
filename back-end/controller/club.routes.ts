
import express, { NextFunction, Request, Response } from 'express';
import clubService from "../service/club.service";

const clubRouter = express.Router();

clubRouter.get("/", async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const clubs = await clubService.getAllClubs();
        res.json(clubs);
    } catch (error) {
        next(error);
    }
});

clubRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const club = await clubService.getClubById(id);
        res.json(club);
    } catch (error) {
        next(error);
    }
});

export default clubRouter;