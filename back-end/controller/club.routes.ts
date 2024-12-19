
import express, { NextFunction, Request, Response } from 'express';
import clubService from "../service/club.service";

const clubRouter = express.Router();


/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of all clubs
 *     responses:
 *       200:
 *         description: A list of clubs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Club'
 *       500:
 *         description: Internal server error
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
 * /{id}:
 *   get:
 *     summary: Retrieve a club by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the club to retrieve
 *     responses:
 *       200:
 *         description: A club object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       404:
 *         description: Club not found
 *       500:
 *         description: Internal server error
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