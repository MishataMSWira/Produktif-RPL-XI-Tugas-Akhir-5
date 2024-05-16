import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** create schema when add new egg's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    customer_id: Joi.string().required(),
    room_typeId : Joi.string().required(),
    check_in: Joi.string().required(),
    check_out: Joi.string().required(),
    number_of_night: Joi.string().required(),
    amount_of_guests: Joi.string().required(),
    price: Joi.string().required(),
    // room_detail: Joi.array().required().items({
    //     room_id: Joi.required(),
    //     quantity: Joi.number().required().min(1), // Added validation for minimum quantity
    //     price: Joi.number().required()
    //   })
})

/** create schema when edit egg's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    customer_id: Joi.string().optional(),
    room_typeId : Joi.string().optional(),
    check_in: Joi.string().optional(),
    check_out: Joi.string().optional(),
    number_of_night: Joi.string().optional(),
    amount_of_guests: Joi.string().optional(),
    price: Joi.string().optional(),
    // food_id: Joi.number().optional(),
    // quantity: Joi.number().optional().min(1), // Optional quantity with minimum validation
    // price: Joi.number().optional()
  })

export const verifyAddReservation = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }
    return next()
}

export const verifyEditReservation = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}