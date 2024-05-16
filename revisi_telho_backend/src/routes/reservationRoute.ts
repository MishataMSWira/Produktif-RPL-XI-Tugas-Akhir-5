import express from "express"
import { verifyToken } from "../middlewares/authorization"
import { verifyAddReservation, verifyEditReservation } from "../middlewares/verifyReservation"
import { createReservation, dropReservation, updateReservation } from "../controllers/reservationController"

const app = express()
app.use(express.json())

// app.get(`/`, get)
app.post(`/`, [verifyToken, verifyAddReservation], createReservation)
app.put(`/:id`, [verifyToken, verifyEditReservation], updateReservation)
app.delete(`/:id`, [verifyToken], dropReservation)

export default app