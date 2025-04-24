import express, { NextFunction, Request, Response } from 'express';
import memberService from "../service/member.service";

const memberRouter = express.Router();


/**
 * @swagger
 * components:
 *  schemas:
 *      Member:
 *          type: object
 *          required:
 *              - password
 *              - person
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the member
 *              password:
 *                  type: string
 *                  description: The password of the member
 *              person:
 *                  $ref: '#/components/schemas/Person'
 *          example:
 *              id: 1
 *              password: securepassword123
 *              person:
 *                  id: 1
 *                  name: John Doe
 *                  email: john.doe@mail.com
 *
 * tags:
 *  name: Member
 *  description: The members managing API
 * 
 * /member:
 *  get:
 *      summary: Get all members
 *      tags: [Member]
 *      responses:
 *          200:
 *              description: A list of members
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Member'
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
 * /member/{id}:
 *  get:
 *      summary: Get a member by id
 *      tags: [Member]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the region
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: A member by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Member'
 *          404:
 *              description: Member not found
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