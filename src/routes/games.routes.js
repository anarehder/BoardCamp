import { getGames, insertGame } from "../controllers/games.controller.js"

const gamesRoutes = Router()

userRoutes.get("/games", getGames)
userRoutes.post("/games", insertGame)

export default gamesRoutes