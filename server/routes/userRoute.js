const express = require("express");
const {getMyProfile,updateProfile,getAllUser,} = require("../controllers/userController")
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const userRouter = express.Router();

userRouter.get("/me",auth,getMyProfile);
userRouter.put("/me",auth,updateProfile);
userRouter.get("/all",auth,roleMiddleware("admin"),getAllUser);



module.exports = userRouter;