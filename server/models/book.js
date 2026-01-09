const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true
        },
        ISBNNo : {
            type : String,
            required : true,
            unique : true,
            trim : true
        },
        author : {
            type : String,
            required : true,
            trim : true
        },
        category : {
            type : String,
            required : true,
            trim : true
        },
        publisher : {
            type : String,
            required : true,
            trim : true
        },
        publishedYear : {
            type : Number,
            required : true,
        },
        edition : {
            type : String,
            required : true,
            trim : true
        },
        pages : {
            type : Number,
            required : true
        },
        language : {
            type : String,
            required : true,
            trim : true
        },
        location : {
            type : String,
            required : true,
            trim : true
        },
        description : {
            type : String,
            required : true,
            trim : true
        },
        totalCopies : {
            type : Number,
            required : true
        },
        issuedCopies : {
            type : Number,
            required : true,
        }
    },
    {
        timestamps : true
    }
);


module.exports = mongoose.model("book",bookSchema);