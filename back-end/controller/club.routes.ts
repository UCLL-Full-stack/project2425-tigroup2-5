import { Router } from "express";
import clubService from "../service/club.service";

const clubRouter = Router();


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
clubRouter.get("/", async (req, res) => {
    try {
        const clubs = await clubService.getAllClubs();
        res.json(clubs);
    } catch (error) {
        res.status(500).send((error as Error).message);
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
clubRouter.get("/:id", async (req, res) => {
    try {
        const club = await clubService.getClubById(Number(req.params.id));
        if (club === undefined) {
            res.status(404).send(`Club with id ${req.params.id} not found`);
        } else {
            res.json(club);
        }
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

export default clubRouter;