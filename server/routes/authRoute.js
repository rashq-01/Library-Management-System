const express = require("express");
const { registerUser, login, verifyEmail} = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login",login);
authRouter.get("/auth/verify-email",verifyEmail);

module.exports = authRouter;