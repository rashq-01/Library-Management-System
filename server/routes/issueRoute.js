const express = require("express");
const {issueBook,returnBook,getMyIssuedBooks} = require("../controllers/issueController");
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const issueRouter = express.Router();

issueRouter.post("/issue",auth,roleMiddleware("admin"),issueBook);

issueRouter.post("/return",auth,roleMiddleware("admin"),returnBook);

issueRouter.get("/my-issued",auth,getMyIssuedBooks);



module.exports = issueRouter;