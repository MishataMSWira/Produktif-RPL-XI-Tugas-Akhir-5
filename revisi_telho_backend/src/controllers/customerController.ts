import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5"
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getCustomer = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allCustomer = await prisma.customer.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })
        /** contains means search name of admin based on sent keyword */

        return response.json({
            status: true,
            data: allCustomer,
            message: `Customer has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const createCustomer = async (request: Request, response: Response) => {
    try {
        const { name,email, password } = request.body /** get requested data (data has been sent from request) */

        /** process to save new admin */
        const newCustomer = await prisma.customer.create({
            data: {
                name, email, password: md5(password) 
            }
        })

        return response.json({
            status: true,
            data: newCustomer,
            message: `Customer has created`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const updateCustomer = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */
        const { name, email, password } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findCustomer = await prisma.customer.findFirst({ where: { id: Number(id) } })
        if (!findCustomer) return response
            .status(200)
            .json({ status: false, message: `Customer is not found` })

        /** process to update admin's data */
        const updatedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: {
                name: name || findCustomer.name,
                email: email || findCustomer.email,
                password: password ? md5(password) : findCustomer.password
            }
        })

        return response.json({
            status: true,
            data: updatedCustomer,
            message: `Customer has updated`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const dropCustomer = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */

        /** make sure that data is exists in database */
        const findCustomer = await prisma.customer.findFirst({ where: { id: Number(id) } })
        if (!findCustomer) return response
            .status(200)
            .json({ status: false, message: `Customer is not found` })

        /** process to delete admin's data */
        const deletedCustomer = await prisma.customer.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deletedCustomer,
            message: `Customer has deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const authentication = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body /** get requested data (data has been sent from request) */

        /** find a valid admin based on username and password */
        const findCustomer = await prisma.customer.findFirst({
            where: { name, email, password: md5(password) }
        })

        /** check is admin exists */
        if (!findCustomer) return response
            .status(200)
            .json({ status: false, logged: false, message: `Username or password is invalid` })

        /** define payload to generate token */
        let payload = JSON.stringify(findCustomer)

        /** define key of generate token */
        let secretKey = process.env.JWT_SECRET_KEY

        /** generate token */
        let token = sign(payload, secretKey || "joss")

        return response
            .status(200)
            .json({ status: true, logged: true, message: `Login Success`, token })
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}