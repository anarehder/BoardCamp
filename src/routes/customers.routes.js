import { Router } from "express"
import { editCustomer, getCustomers, getCustomersById, insertCustomer } from "../controllers/customers.contoller.js"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"
import { customersSchema } from "../schemas/customers.schemas.js"

const customersRoutes = Router()

customersRoutes.get("/customers",getCustomers)
customersRoutes.get("/customers/:id", getCustomersById)
customersRoutes.post("/customers", validateSchema(customersSchema), insertCustomer)
customersRoutes.put("/customers/:id", validateSchema(customersSchema), editCustomer)

export default customersRoutes
