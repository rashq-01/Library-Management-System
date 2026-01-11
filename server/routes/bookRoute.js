const express = require("express");
const bookController = require("../controllers/bookController");
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const bookRouter = express.Router();

// GET
bookRouter.get("/getBook",auth,bookController.getAllBooks);


// POST
bookRouter.post("/addBook",auth,roleMiddleware("admin"),bookController.addBook);

// DELETE
bookRouter.delete("/deleteBook",auth,roleMiddleware("admin"),bookController.deleteBook);

module.exports = bookRouter;