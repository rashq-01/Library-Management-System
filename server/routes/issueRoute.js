const express = require("express");
const {issueBook,returnBook,getMyIssuedBooks,fineCalculation} = require("../controllers/issueController");
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const issueRouter = express.Router();

issueRouter.post("/admin/issue",auth,roleMiddleware("admin"),issueBook);

issueRouter.post("/admin/return",auth,roleMiddleware("admin"),returnBook);
issueRouter.post("/admin/calculate",auth,roleMiddleware("admin"),fineCalculation);

issueRouter.get("/my-issued",auth,getMyIssuedBooks);



module.exports = issueRouter;