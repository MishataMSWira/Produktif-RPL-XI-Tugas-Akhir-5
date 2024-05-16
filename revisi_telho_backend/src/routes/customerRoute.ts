import express from "express"
import { verifyToken } from "../middlewares/authorization"
import { authentication, createCustomer, dropCustomer, getCustomer, updateCustomer } from "../controllers/customerController"
import { verifyAddCustomer, verifyAuthentication } from "../middlewares/verifyCustomer"



const app = express()

app.use(express.json())

app.get(`/`,[verifyToken], getCustomer)
app.post(`/`,createCustomer)
app.put(`/:id`,[verifyToken, verifyAddCustomer], updateCustomer)
app.delete(`/:id`,[verifyToken,], dropCustomer)

app.post(`/auth`, [verifyAuthentication], authentication)
export default app