import { Router } from "express"
import { deleteRental, finishRental, getRentals, insertRental } from "../controllers/rentals.controller.js"

const rentalRoutes = Router()

rentalRoutes.get("/rentals", getRentals)
rentalRoutes.post("/rentals", insertRental)
rentalRoutes.post("/rentals/:id/return", finishRental)
rentalRoutes.delete("/rentals/:id", deleteRental)

export default rentalRoutes