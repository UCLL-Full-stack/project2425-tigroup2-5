import e, { Router } from "express";
import employeeService from "../service/employee.service";

const employeeRouter = Router();

employeeRouter.get("/", async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
});

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