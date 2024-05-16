import { NextFunction, Request, Response } from 'express'
import Joi, { optional } from 'joi'

/** create schema when add new egg's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    name: Joi.string().required(),
    max_guests : Joi.string().required(),
    room_price: Joi.number().min(0).required(),
    image: Joi.allow().optional(),
    description: Joi.string().optional(),
})

/** create schema when edit egg's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    name: Joi.string().optional(),
    max_guests : Joi.string().optional(),
    room_price: Joi.number().min(0).optional(),
    image: Joi.allow().optional(),
    description: Joi.string().optional(),
})

export const verifyAddRoomType = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditRoomType = (request: Request, response: Response, next: NextFunction) => {
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