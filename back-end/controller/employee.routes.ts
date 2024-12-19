import e, { Router } from "express";
import employeeService from "../service/employee.service";

const employeeRouter = Router();
/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of all employees
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Internal server error
 */

employeeRouter.get("/", async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve an employee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: An employee object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

employeeRouter.get("/:id", async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(Number(req.params.id));
        if (employee === undefined) {
            res.status(404).send(`Employee with id ${req.params.id} not found`);
        } else {
            res.json(employee);
        }
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

export default employeeRouter;