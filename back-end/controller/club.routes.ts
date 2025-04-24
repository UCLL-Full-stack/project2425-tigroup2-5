
import express, { NextFunction, Request, Response } from 'express';
import clubService from "../service/club.service";

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
 */

clubRouter.get("/", async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const clubs = await clubService.getAllClubs();
        res.json(clubs);
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