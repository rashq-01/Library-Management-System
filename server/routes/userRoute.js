const express = require("express");
const {getMyProfile,updateProfile,getAllUser,getAdminProfile, recentTransaction} = require("../controllers/userController")
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const userRouter = express.Router();

userRouter.get("/me",auth,getMyProfile);
userRouter.get("/admin/me",auth,getAdminProfile);
userRouter.put("/update",auth,updateProfile);
userRouter.get("/admin/allUser",auth,roleMiddleware("admin"),getAllUser);
userRouter.get("/admin/recentTransaction",auth,roleMiddleware("admin"),recentTransaction);



module.exports = userRouter;