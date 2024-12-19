import express, { NextFunction, Request, Response } from 'express';
import memberService from "../service/member.service";

const memberRouter = express.Router();

memberRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const members = await memberService.getAllMembers();
        res.status(200).json(members);
    } catch (error) {
        next(error);
    }
});

memberRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const member = await memberService.getMemberById(id);
        res.status(200).json(member);
    } catch (error) {
        next(error);
    }
});

export default memberRouter;