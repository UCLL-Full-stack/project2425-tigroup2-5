import regionService from "../service/region.service";
import express, { NextFunction, Request, Response } from 'express';

const regionRouter = express.Router();


/**
 * @swagger
 * components:
 *  schemas:
 *      Region:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the region
 *              name:
 *                  type: string
 *                  description: The name of the region
 *          example:
 *              id: 1
 *              name: "Region 1"
 *
 * tags:
 *  name: Region
 *  description: The regions managing API
 * 
 * /region:
 *  get:
 *      summary: Get all regions
 *      tags: [Region]
 *      responses:
 *          200:
 *              description: A list of regions
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Region'
 */

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
 * /region:
 *  post:
 *      summary: Create a new region
 *      tags: [Region]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Region'
 *      responses:
 *          201:
 *              description: The region was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Region'
 *          400:
 *              description: Bad request
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


/**
 * @swagger
 * /region/{id}:
 *  get:
 *      summary: Get a region by id
 *      tags: [Region]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the region
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: A region by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Region'
 *          404:
 *              description: Region not found
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