import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllRoomTypes = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allRoomTypes = await prisma.room_type.findMany({
            where: { name: { contains: search?.toString() || "", } }
        })
        /** contains means search name of egg based on sent keyword */
        return response.json({
            status: true,
            data: allRoomTypes,
            message: `Room Types has retrieved`
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

export const createRoomType = async (request: Request, response: Response) => {
    try {
        const { name, max_guests, room_price, description } = request.body /** get requested data (data has been sent from request) */

        /** variable filename use to define of uploaded file name */
        let filename = ""
        if (request.file) filename = request.file.filename /** get file name of uploaded file */

        /** process to save new egg */
        const newRoomType = await prisma.room_type.create({
            data: { name, room_price: Number(room_price), max_guests, image: filename, description }
        })
        /** price and stock have to convert in number type */

        return response.json({
            status: true,
            data: newRoomType,
            message: `New Room Type has created`
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

export const updateRoomType = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */
        const { name, max_guests, room_price, description } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findRoomType = await prisma.room_type.findFirst({ where: { id: Number(id) } })
        if (!findRoomType) return response
            .status(200)
            .json({ status: false, message: `Room Type is not found` })

        let filename = findRoomType.image /** default value of variable filename based on saved information */
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/public/room-image/${findRoomType.image}`
            let exists = fs.existsSync(path)
            if (exists && findRoomType.image !== ``) fs.unlinkSync(path)

            /** this code use to delete old exists file if reupload new file */
        }

        /** process to update egg's data */
        const updatedRoomType = await prisma.room_type.update({
            data: {
                name: name || findRoomType.name,
                max_guests: max_guests || findRoomType.max_guests,
                room_price: room_price || findRoomType.max_guests,
                description: description || findRoomType.description,
                image: filename
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updatedRoomType,
            message: `Room Type has been updated`
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

export const dropRoomType = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        /** make sure that data is exists in database */
        const findRoomType = await prisma.room_type.findFirst({ where: { id: Number(id) } })
        if (!findRoomType) return response
            .status(200)
            .json({ status: false, message: `Room Type is not found` })

        /** prepare to delete file of deleted egg's data */
        let path = `${BASE_URL}/public/room-image/${findRoomType.image}` /** define path (address) of file location */
        let exists = fs.existsSync(path)
        if (exists && findRoomType.image !== ``) fs.unlinkSync(path) /** if file exist, then will be delete */

        /** process to delete egg's data */
        const deletedRoomType = await prisma.room_type.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deletedRoomType,
            message: `Food has been deleted`
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