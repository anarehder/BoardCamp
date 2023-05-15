import { Router } from "express"
import gamesRoutes from "./games.routes.js"
import customersRoutes from "./customers.routes.js"
import rentalRoutes from "./rentals.routes.js"

const router = Router()
router.use(gamesRoutes)
router.use(customersRoutes)
router.use(rentalRoutes)

export default router