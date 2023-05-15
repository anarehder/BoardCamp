import { db } from "../database/database.js";

export async function getGames(req, res) {
  try {
    const games = await db.query(`SELECT * FROM games`);
    res.send(games.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function insertGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const gameExists = await db.query(`SELECT * FROM games WHERE name=$1;`, [req.body.name]);
    console.log(gameExists.rows[0])
    if (!gameExists.rows[0]) {
      await db.query(
        `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`
        , [name, image, stockTotal, pricePerDay]);
      res.sendStatus(201);
    } else {
      res.status(409).send("Já existe um jogo cadastrado com este nome");
    }

  } catch (err) {
    res.status(500).send(err.message);
  }
}