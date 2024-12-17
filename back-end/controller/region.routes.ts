import { Router } from "express";
import regionService from "../service/region.service";

const regionRouter = Router();

regionRouter.get("/", async (req, res) => {
    try {
        const regions = await regionService.getAllRegions();
        res.json(regions);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

regionRouter.get("/:id", async (req, res) => {
    try {
        const region = await regionService.getRegionById(Number(req.params.id));
        if (region === undefined) {
            res.status(404).send(`Region with id ${req.params.id} not found`);
        } else {
            res.json(region);
        }
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

export default regionRouter;