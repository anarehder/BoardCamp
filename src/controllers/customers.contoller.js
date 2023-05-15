import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function getCustomers(req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers`);
    const customersRecieved = customers.rows;
    console.log(customersRecieved);
    customersRecieved.forEach((element) => {
      element.birthday = dayjs(element.birthday).format('YYYY-MM-DD');
  });
    res.send(customersRecieved);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getCustomersById(req, res) {
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [req.params.id]);
    if (!customer.rows[0]){
      res.sendStatus(404);
    } else {
      const customerRecieved = customer.rows[0];
      console.log(customerRecieved);
      customerRecieved.birthday = dayjs(customerRecieved.birthday).format('YYYY-MM-DD');
      res.send(customerRecieved)
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function insertCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customerExists = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [req.body.cpf]);
    console.log(customerExists.rows[0])
    if (!customerExists.rows[0]) {
      await db.query(
        `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`
        , [name, phone, cpf, birthday]);
      res.sendStatus(201);
    } else {
      res.status(409).send("Já existe um cliente cadastrado com este CPF");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function editCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customerExists = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [req.body.cpf]);
    console.log(birthday)
    console.log(customerExists)
    if (!customerExists.rows[0] || customerExists.rows[0].id === Number(req.params.id)) {
      await db.query(
        `UPDATE customers SET 
              name = $1, phone = $2, cpf =$3, birthday = $4
              WHERE id = $5;`
        , [name, phone, cpf, birthday, req.params.id]);
      res.sendStatus(200);
    } else {
      res.status(409).send("Este CPF está cadastrado em outro cliente");
    }
    
  } catch (err) {
    res.status(500).send(err.message);
  }
}