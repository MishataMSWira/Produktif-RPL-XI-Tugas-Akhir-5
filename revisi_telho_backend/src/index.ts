import express, {Request, Response} from "express"
import AdminRoute from "./routes/adminRoute"
import CustomerRoute from "./routes/customerRoute"
import ReservationRoute from "./routes/reservationRoute"
import RoomRoute from "./routes/roomRoute"
import RoomTypeRoute from "./routes/roomtypeRoute"
import path from "path"
import cors from "cors"

const app = express()

const PORT = 2024

var corsOptions = {
    origin: "*",
    credentials: true,
}

app.use(cors(corsOptions));

app.use(`/admin`, AdminRoute)
app.use(`/customer`, CustomerRoute)
app.use(`/reservation`, ReservationRoute)
app.use(`/room`, RoomRoute)
app.use(`/roomtype`, RoomTypeRoute)
app.use(`/public`, express.static(path.join(__dirname, `public`)))






app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`)
})

