import { Router } from "express"
import { getGames, insertGame } from "../controllers/games.controller.js"
import { gamesSchema } from "../schemas/games.schemas.js"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"

const gamesRoutes = Router()

gamesRoutes.get("/games", getGames)
gamesRoutes.post("/games", validateSchema(gamesSchema), insertGame)

export default gamesRoutes