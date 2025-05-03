import express, { NextFunction, Request, Response } from 'express';
import clubService from "../service/club.service";
import regionService from '../service/region.service';

const clubRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Club:
 *          type: object
 *          required:
 *              - id
 *              - address
 *              - region
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the club
 *              address:
 *                  type: string
 *                  description: The name of the club
 *              region:
 *                  type: Region
 *                  description: The region of the club
 *          example:
 *              id: 1
 *              name: "Real Madrid"
 *              region: "Madrid"
 *
 * tags:
 *  name: Club
 *  description: The regions managing API
 * 
 * /club:
 *  get:
 *      summary: Get all regions
 *      tags: [Club]
 *      responses:
 *          200:
 *              description: A list of clubs
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Club'
 *  post:
 *      summary: Create a new club
 *      tags: [Club]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - address
 *                          - regionId
 *                      properties:
 *                          address:
 *                              type: string
 *                              description: The address of the club
 *                          regionId:
 *                              type: integer
 *                              description: The ID of the region for the club
 *      responses:
 *          201:
 *              description: Club created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Club'
 *          400:
 *              description: Invalid input data
 *          500:
 *              description: Server error
 */

clubRouter.get("/", async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const clubs = await clubService.getAllClubs();
        res.json(clubs);
    } catch (error) {
        next(error);
    }
});

clubRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address, regionId } = req.body;
        
        if (!address || !regionId) {
            return res.status(400).json({ message: "Address and regionId are required" });
        }
        
        const region = await regionService.getRegionById(Number(regionId));
        if (!region) {
            return res.status(400).json({ message: "Invalid regionId" });
        }
        const newClub = await clubService.createClub({ address, region });
        res.status(201).json(newClub);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /club/{id}:
 *  get:
 *      summary: Get a club by id
 *      tags: [Club]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The club id
 *      responses:
 *          200:
 *              description: A club by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Club'
 *          404:
 *              description: The club was not found
 */

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