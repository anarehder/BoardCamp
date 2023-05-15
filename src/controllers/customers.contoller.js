import { db } from "../database/database.js";

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers`);
        res.send(customers.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function getCustomersById(req, res) {
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [req.params.id]);
        res.send(customer.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function insertCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
      await db.query(
        `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`
        ,[name, phone, cpf, birthday]);
      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err.message);
    }
}

export async function editCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
      await db.query(
        `UPDATE customers SET 
            name = ${name}, phone = ${phone}, cpf =${cpf}, birthday = ${birthday}
            WHERE id = $1;`
        ,[req.params.id]);
      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err.message);
    }
}