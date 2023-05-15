import { editCustomer, getCustomers, getCustomersById, insertCustomer } from "../controllers/customers.contoller.js"

const customersRoutes = Router()

userRoutes.get("/customers", getCustomers)
userRoutes.get("/customers/:id", getCustomersById)
userRoutes.post("/customers", insertCustomer)
userRoutes.put("/customers/:id", editCustomer)

export default customersRoutes = Router()
