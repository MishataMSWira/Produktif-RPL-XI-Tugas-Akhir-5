import express from "express"
import { createRoom, dropRoom, getAllRoom, updateRoom } from "../controllers/roomController"
import { verifyToken } from "../middlewares/authorization"
import { verifyAddRoom, verifyEditRoom } from "../middlewares/verifyRoom"

const app = express()
app.use(express.json())

app.get(`/`, getAllRoom)
app.post(`/`, [verifyToken, verifyAddRoom], createRoom)
app.put(`/:id`, [verifyToken, verifyEditRoom], updateRoom)
app.delete(`/:id`, [verifyToken], dropRoom)

export default app