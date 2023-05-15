import { db } from "../database/database.js";

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`SELECT * FROM rentals`);
        res.send(rentals.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const pricePerDay = await db.query(`SELECT pricePerDay FROM games WHERE id=$1;`, [gameId]);
        const originalPrice = Number(daysRented) * Number(pricePerDay);

        await db.query(
            `INSERT INTO rentals (customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee)
                VALUES ($1, $2, CURRENT_DATE(), $3, $4, null, ${originalPrice}, null);`
            , [customerId, gameId, daysRented]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finishRental(req, res) {

    try {
        
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [req.params.id]);
        const expectedReturn = await db.query(`SELECT ADDDATE(rental.rows[0].rentDate, INTERVAL rental.rows[0].daysRented DAY);`);
        const daysExtra = await db.query(`SELECT DATEDIFF(CURRENT_DATE(), ${expectedReturn});`);  
        const delayFee = (rental.rows[0].originalPrice / Number(rental.rows[0].daysRented))*daysExtra;

        await db.query(
            `INSERT INTO rentals (returnDate, delayFee)
                VALUES (CURRENT_DATE(), ${delayFee})
                WHERE id=$1;`, [req.params.id]);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function deleteRental(req, res) {
    try {
        const rental = await db.query(`DELETE FROM rentals WHERE id=$1;`, [req.params.id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}