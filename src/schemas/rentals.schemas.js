import joi from "joi"

export const rentalsSchema = joi.object({
    customerId: joi.number().integer().min(1),
    gameId: joi.number().integer().min(1),
    daysRented: joi.number().integer().min(1)
})