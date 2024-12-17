import { Router } from "express";
import memberService from "../service/member.service";

const memberRouter = Router();

memberRouter.get("/", async (req, res) => {
    try {
        const members = await memberService.getAllMembers();
        res.json(members);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

memberRouter.get("/:id", async (req, res) => {
    try {
        const member = await memberService.getMemberById(Number(req.params.id));
        if (member === undefined) {
            res.status(404).send(`Member with id ${req.params.id} not found`);
        } else {
            res.json(member);
        }
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

export default memberRouter;