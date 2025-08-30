import express from "express"
const router = express.Router()
import { login, signUp } from "../controllers/auth.js"
import { registerValidation, loginValidation } from "../middlewares/express-validator.js"

router.post("/auth/signup", registerValidation, signUp)
router.post("/auth/login", loginValidation, login)


export default router
