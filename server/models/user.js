const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : true,
            trim : true,

        },
        rollNumber : {
            type : String,
            required : true,
            unique : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        isVerified : {
            type : Boolean,
            default : false,
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            enum  : ["admin","student"],
            default : "student"
        },
        emailVerificationToken : {
            type : String,
        },
        emailVerificationTokenExpire : {
            type : Date
        }
    },
    {
        timestamps : true
    }
);

userSchema.index({
    rollNumber : 1
})

module.exports = mongoose.model("user",userSchema);