import { Router } from "express"
import { deleteRental, finishRental, getRentals, insertRental } from "../controllers/rentals.controller.js"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"
import { rentalsSchema } from "../schemas/rentals.schemas.js"

const rentalRoutes = Router()

rentalRoutes.get("/rentals", getRentals)
rentalRoutes.post("/rentals", validateSchema(rentalsSchema), insertRental)
rentalRoutes.post("/rentals/:id/return", finishRental)
rentalRoutes.delete("/rentals/:id", deleteRental)

export default rentalRoutes