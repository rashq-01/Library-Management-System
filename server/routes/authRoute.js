const express = require("express");
const { registerUser, login } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login",login);

module.exports = authRouter;