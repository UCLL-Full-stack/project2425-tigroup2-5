import { Router } from "express";
import employeeService from "../service/employee.service";

const employeeRouter = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Employee:
 *          type: object
 *          required:
 *              - admin
 *              - title
 *              - person
 *              - salary
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The auto-generated id of the employee
 *              admin:
 *                  type: boolean
 *                  description: Whether the employee is an admin
 *              title:
 *                  type: string
 *                  description: The title of the employee
 *              person:
 *                  type: object
 *                  description: The person details of the employee
 *                  properties:
 *                      name:
 *                          type: string
 *                          description: The name of the person
 *                      age:
 *                          type: integer
 *                          description: The age of the person
 *              salary:
 *                  type: number
 *                  description: The salary of the employee
 *          example:
 *              id: 1
 *              admin: true
 *              title: "Manager"
 *              person: 
 *                  name: "John Doe"
 *                  age: 30
 *              salary: 75000
 *
 * tags:
 *  name: Employee
 *  description: The employees managing API
 * 
 * /employee:
 *  get:
 *      summary: Get all employees
 *      tags: [Employee]
 *      responses:
 *          200:
 *              description: A list of employees
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Employee'
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
 * /employee/{id}:
 *  get:
 *      summary: Get an employee by id
 *      tags: [Employee]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The id of the employee
 *      responses:
 *          200:
 *              description: An employee object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Employee'
 *          404:
 *              description: The employee was not found
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