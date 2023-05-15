import { Router } from "express"
import { editCustomer, getCustomers, getCustomersById, insertCustomer } from "../controllers/customers.contoller.js"

const customersRoutes = Router()

customersRoutes.get("/customers", getCustomers)
customersRoutes.get("/customers/:id", getCustomersById)
customersRoutes.post("/customers", insertCustomer)
customersRoutes.put("/customers/:id", editCustomer)

export default customersRoutes
