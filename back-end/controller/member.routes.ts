import { Router } from "express";
import memberService from "../service/member.service";

const memberRouter = Router();
/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of all members
 *     responses:
 *       200:
 *         description: A list of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       500:
 *         description: Internal server error
 */


memberRouter.get("/", async (req, res) => {
    try {
        const members = await memberService.getAllMembers();
        res.json(members);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve a member by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The member ID
 *     responses:
 *       200:
 *         description: A member object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
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