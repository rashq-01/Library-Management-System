const user = require("../models/user.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

async function registerUser(req, res) {
  try {
    //Fetching all requests
    const { fullName, rollNumber, email, password, confirmPassword} = req.body;


    if (!fullName || !rollNumber || !email || !password ||!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if(password != confirmPassword){
      return res.status(409).json({
        success : false,
        message : "Password do not matched."
      });
    }

    const User = await user.findOne({ email });

    if (User) {
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hashing Password
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      fullName: fullName,
      rollNumber: rollNumber,
      email: email,
      role: "student",
      password: hashPassword,
    });

    // Saving newUser to DB
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created  Successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    // Fetching data from req body
    const { emailOrRoll, password } = req.body;

    if (!emailOrRoll || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const User = await user.findOne({
      $or: [{ email: emailOrRoll }, { rollNumber: emailOrRoll }],
    });
    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, User.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password do not match",
      });
    }

    const token = jwt.sign(
      {
        _id: User._id,
        role: User.role,
      },
      SECRET_KEY,
      { expiresIn: "60m" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: User.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { registerUser, login };
