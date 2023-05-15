import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(
            `SELECT rentals.*, games.id AS game_id, games.name AS game_name, customers.id AS customer_id, customers.name AS customer_name
                FROM rentals 
                JOIN games ON rentals."gameId" = games.id
                JOIN customers ON rentals."customerId" = customers.id;`
        );

        const rentalsComplete = rentals.rows.map((item) => ({
            id: item.id,
            customerId: item.customerId,
            gameId: item.gameId,
            rentDate: dayjs(item.rentDate).format('YYYY-MM-DD'),
            daysRented: item.daysRented,
            returnDate: item.returnDate ? dayjs(item.returnDate).format('YYYY-MM-DD') : null,
            originalPrice: item.originalPrice,
            delayFee: item.returnDate ? item.delayFee : null,
            customer: {
                id: item.customer_id,
                name: item.customer_name
            },
            game: {
                id: item.game_id,
                name: item.game_name
            }
        }));

        res.send(rentalsComplete);
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
        if (stockTotal > rentedAmount) {
            await db.query(
                `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                    VALUES ($1, $2, 'NOW()', $3, null, $4, null);`
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

    const returnDate = dayjs().format('YYYY-MM-DD');
    const returnDateForCalc = dayjs().startOf('day');

    try {
        const rentalAspects = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [req.params.id]);
        if (!rentalAspects.rows[0]) {
            res.status(404).send("Esse id não está cadastrado");
        } else if (rentalAspects.rows[0].returnDate !== null) {
            res.status(400).send("O aluguel já está finalizado");
        } else {
            const days = Math.floor((returnDateForCalc.valueOf() - rentalAspects.rows[0].rentDate.valueOf())/86400000);
            let delayFee;
            if(days > rentalAspects.rows[0].daysRented){
                delayFee = (days - rentalAspects.rows[0].daysRented) * (rentalAspects.rows[0].originalPrice / rentalAspects.rows[0].daysRented);
            }else{
                delayFee = 0;
            }    
            await db.query(`UPDATE rentals SET "delayFee" = $1, "returnDate" = $2 WHERE id = $3;`,[delayFee, returnDate, req.params.id]);
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