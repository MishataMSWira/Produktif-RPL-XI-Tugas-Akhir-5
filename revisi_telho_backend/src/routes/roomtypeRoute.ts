import express from "express"
import { createRoomType, dropRoomType, getAllRoomTypes, updateRoomType } from "../controllers/roomtypeController"
import { verifyToken } from "../middlewares/authorization"
import { verifyAddRoomType, verifyEditRoomType } from "../middlewares/verifyRoomType"

const app = express()
app.use(express.json())

app.get(`/`, getAllRoomTypes)
app.post(`/`, [verifyToken, verifyAddRoomType], createRoomType)
app.put(`/:id`, [verifyToken, verifyEditRoomType], updateRoomType)
app.delete(`/:id`, [verifyToken], dropRoomType)

export default app