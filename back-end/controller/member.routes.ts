import express, { NextFunction, Request, Response } from 'express';
import memberService from "../service/member.service";

const memberRouter = express.Router();
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
memberRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const members = await memberService.getAllMembers();
        res.status(200).json(members);
    } catch (error) {
        next(error);
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
memberRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const member = await memberService.getMemberById(id);
        res.status(200).json(member);
    } catch (error) {
        next(error);
    }
});

export default memberRouter;