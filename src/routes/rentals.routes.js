import { deleteRental, finishRental, getRentals, insertRental } from "../controllers/rentals.controller.js"

const rentalRoutes = Router()

userRoutes.get("/rentals", getRentals)
userRoutes.post("/rentals", insertRental)
userRoutes.post("/rentals/:id/return", finishRental)
userRoutes.delete("/rentals/:id", deleteRental)

export default rentalRoutes