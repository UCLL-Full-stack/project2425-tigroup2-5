import regionService from "../service/region.service";
import express, { NextFunction, Request, Response } from 'express';

const regionRouter = express.Router();

regionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regions = await regionService.getAllRegions();
        res.status(200).json(regions);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /regions:
 *  post:
 *   summary: Create a new region
 *    requestBody:
 *    required: true
 *   content:
 *   application/json:
 *      schema:
 *         $ref: '#/components/schemas/Region'
 *   responses:
 *     200: 
 *        description: the created region object
 * 
 */
regionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const region = req.body;
        const newRegion = await regionService.createRegion(region);
        res.status(201).json(newRegion);
    } catch (error) {
        next(error);
    }
});

regionRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const region = await regionService.getRegionById(id);
        res.status(200).json(region);
    } catch (error) {
        next(error);
    }
});

export default regionRouter;