const book = require("../models/book")
async function addBook(req,res){
    try{
        if (req.user.role != "admin") {
            return res.status(403).json({
            success: false,
            message: "Access denied. Admin only.",
            });
        }

        const{title,ISBNNumber,author,category,publisher,publishedYear,edition,pages,language,location,description,totalCopies} = req.body;

        if(!title || !ISBNNumber || !author || !category || !publisher || !publishedYear || !edition || !pages || !language || !location || !description || !totalCopies){
            return res.status(400).json({
            success : false,
            message : "All fields required"
            });
        }

        const BOOK = await book.findOne({ISBNNumber});

        if(BOOK){
            return res.status(409).json({
                success : false,
                message : "Book already Exists."
            });
        }

        const newBook = new book({
            title,
            ISBNNumber,
            author,
            category,
            publisher,
            publishedYear,
            edition,
            pages,
            language,
            location,
            description,
            totalCopies,
            issuedCopies : 0

        });

        await newBook.save();

        return res.status(201).json({
            success : true,
            message : "Book saved to the DB"
        });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
}


async function getAllBooks(req,res){
    try{

        const BOOKs = await book.find().select("title ISBNNumber category totalCopies issuedCopies");

        return res.status(200).json({
            success : true,
            message : "All book fetched successfully",
            BOOKs : BOOKs
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
}

async function deleteBook(req,res){
    try{
        if(req.user.role != "admin"){
            return res.status(403).json({
                success : false,
                message : "Access denied. Admin only"
            });
        }

        const{ISBNNumber} = req.body;

        if(!ISBNNumber){
            return res.status(400).json({
                success : false,
                message : "ISBN Number is required"
            });
        }

        const BOOK = await book.findOne({ISBNNumber});
        if(!BOOK){
            return res.status(404).json({
                success : false,
                message : "Book is not available"
            });
        }

        if(BOOK.issuedCopies > 0){
            return res.status(409).json({
                success : false,
                message : "Cannot remove, Book is issued to user"
            })
        }
        
        await book.findOneAndDelete({ISBNNumber});

        return res.status(200).json({
            success : true,
            message : "Book deleted successfully"
        });


    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success : false,
            message : err.message
        });
    }
}


module.exports = {addBook, getAllBooks, deleteBook};