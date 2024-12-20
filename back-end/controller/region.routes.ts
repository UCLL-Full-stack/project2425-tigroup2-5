import regionService from "../service/region.service";
import express, { NextFunction, Request, Response } from 'express';

const regionRouter = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of regions
 *     responses:
 *       200:
 *         description: A list of regions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Region Name"
 *       500:
 *         description: Internal server error
 */
regionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regions = await regionService.getAllRegions();
        res.status(200).json(regions);
    } catch (error) {
        next(error);
    }
});


regionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const region = req.body;
        const newRegion = await regionService.createRegion(region);
        res.status(201).json(newRegion);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve a region by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The region ID
 *     responses:
 *       200:
 *         description: A region object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Region Name"
 *       404:
 *         description: Region not found
 *       500:
 *         description: Internal server error
 */
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