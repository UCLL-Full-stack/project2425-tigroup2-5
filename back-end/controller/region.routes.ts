import { Router } from "express";
import regionService from "../service/region.service";

const regionRouter = Router();
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
regionRouter.get("/", async (req, res) => {
    try {
        const regions = await regionService.getAllRegions();
        res.json(regions);
    } catch (error) {
        res.status(500).send((error as Error).message);
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