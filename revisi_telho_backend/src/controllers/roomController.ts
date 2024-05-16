import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllRoom = async (request: Request, response: Response) => {
    try {
        const page = Number(request.query.page) || 1;
      const qty = Number(request.query.qty) || 10;
      const keyword = request.query.keyword?.toString() || "";
      const dataRoom = await prisma.room.findMany({
        take: qty, // mendefinisikan jml data yg diambil
        skip: (page -1) * qty,
        orderBy: {no_room: "asc"}
      });
        return response.json({
            status: true,
            data: dataRoom,
            message: `Room has retrieved`
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

export const createRoom = async (request: Request, response: Response) => {
    try {
        const { no_room, room_typeId } = request.body /** get requested data (data has been sent from request) */

        /** process to save new egg */
        const newRoom = await prisma.room.create({
            data: { no_room, room_typeId }
        })
        /** price and stock have to convert in number type */

        return response.json({
            status: true,
            data: newRoom,
            message: `New Room has created`
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

export const updateRoom = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */
        const { no_room, room_typeId } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findRoom = await prisma.room.findFirst({ where: { id: Number(id) } })
        if (!findRoom) return response
            .status(200)
            .json({ status: false, message: `Room is not found` })



        /** process to update egg's data */
        const updatedRoom = await prisma.room.update({
            data: {
                no_room: no_room || findRoom.no_room,
                room_typeId: room_typeId || findRoom.room_typeId
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updatedRoom,
            message: `Room has been updated`
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

export const dropRoom = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        /** make sure that data is exists in database */
        const findRoom = await prisma.room.findFirst({ where: { id: Number(id) } })
        if (!findRoom) return response
            .status(200)
            .json({ status: false, message: `Room is not found` })

        /** process to delete egg's data */
        const deletedRoom = await prisma.room.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deletedRoom,
            message: `Room has been deleted`
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