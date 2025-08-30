import express from "express"
const router = express.Router()
import { createBook, } from "../controllers/book.js"
import { bookValidator } from "../middlewares/express-validator.js"
import { verifyUser } from "../middlewares/verifyUSer.js"

router.post("/book", verifyUser, bookValidator, createBook)





export default router
