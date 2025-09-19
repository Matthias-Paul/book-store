import express from "express"
const router = express.Router()
import { createBook, uploadImage, upload, getBooks, deleteBook, getUserBooks } from "../controllers/book.js"
import { bookValidator } from "../middlewares/express-validator.js"
import { verifyUser } from "../middlewares/verifyUser.js"
import { multerErrorHandler } from "../utils/multerErrorHandler.js"


router.post("/upload", verifyUser, upload.single("image") , multerErrorHandler ,  uploadImage)
router.post("/book", verifyUser, bookValidator, createBook)
router.get("/books", verifyUser, getBooks)
router.get("/userBooks", verifyUser, getUserBooks)
router.delete("/book/:bookId", verifyUser, deleteBook)





export default router
