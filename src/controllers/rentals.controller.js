import { db } from "../database/database.js";
import dayjs from "dayjs";

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
        const gameAspects = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);

        if (!gameAspects.rows[0]) {
            res.status(400).send("Esse jogo não está cadastrado");
        }
        const stockTotal = gameAspects.rows[0].stockTotal;
        const pricePerDay = gameAspects.rows[0].pricePerDay;
        const originalPrice = Number(daysRented) * Number(pricePerDay);
        console.log(originalPrice)
        const customerData = await db.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);

        if (!customerData.rows[0]) {
            res.status(400).send("Esse cliente não está cadastrado");
        } 
        const rented = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [gameId]);
        const rentedAmount = rented.rows.length;
        console.log("total alugado", rentedAmount);
        if (stockTotal>rentedAmount){
            await db.query(
                `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                    VALUES ($1, $2, NOW(), $3, null, $4, null);`
                , [customerId, gameId, daysRented, originalPrice]);
            res.sendStatus(201);
        } else {
            res.status(400).send("Não há esse item em estoque no momento!");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finishRental(req, res) {

    try {      
        //const daysExtra = await db.query(`SELECT DATEDIFF(CURRENT_DATE(), ${expectedReturn});`);
        //const delayFee = (rental.rows[0].originalPrice / Number(rental.rows[0].daysRented)) * daysExtra;

        const rentalAspects = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [req.params.id]);
        //
        

        if (!rentalAspects.rows[0]) {
            res.status(404).send("Esse id não está cadastrado");
        } else if (rentalAspects.rows[0].returnDate !== null) {
            res.status(400).send("O aluguel já está finalizado");
        } else {
            const daysRented = Number(rentalAspects.rows[0].daysRented);
            const rentDate = dayjs(rentalAspects.rows[0].rentDate).format('YYYY-MM-DD');
            const expectedReturn = rentDate + daysRented;
            const today = dayjs().startOf('day').$d;
            const returnDate = dayjs(today).format('YYYY-MM-DD');
            const differenceDays = returnDate - rentDate;
            console.log(differenceDays)
            // await db.query(`SELECT DATEADD(day, $1, $2);`,[daysRented, rentDate]);
            //console.log(expectedReturn)
/*             await db.query(
                `INSERT INTO rentals (returnDate, delayFee)
                    VALUES (NOW(), $1)
                    WHERE id=$2;`, [delayFee, req.params.id]); */
            res.sendStatus(200);
        } 
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function deleteRental(req, res) {
    try {
        const rentalAspects = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [req.params.id]);

        if (!rentalAspects.rows[0]) {
            res.status(404).send("Esse id não está cadastrado");
        } else if (rentalAspects.rows[0].returnDate === null) {
            res.status(400).send("O aluguel não está finalizado");
        } else {
            await db.query(`DELETE FROM rentals WHERE id=$1;`, [req.params.id]);
            res.sendStatus(200);
        }        
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}