const mongoose = require("mongoose");

const issuedBook = new mongoose.Schema(
    {
        fullName : {
            type : String,
            trim : true,
        },
        title :{
            type : String,
            trim : true,
            required : true
        },
        rollNumber : {
            type : String,
            trim : true,
            required : true
        },
        ISBNNumber : {
            type : String,
            trim : true,
            required : true
        },
        email : {
            type  : String,
            trim : true,
        },
        bookId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "book",
            required : true

        },
        issueDate : {
            type : Date,
            default : Date.now
        },
        dueDate : {
            type : Date,
            required : true,
        },
        returnDate : {
            type : Date,
            default : null
        },
        fine : {
            type : Number,
            default : 0,
            min : 0
        }
    },
    {
        timestamps : true
    }
);

issuedBook.index({
    ISBNNumber : 1,
    rollNumber : 1,
    returnDate : 1
})

module.exports = mongoose.model("issuedBook",issuedBook);
