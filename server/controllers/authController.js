const user = require("../models/user.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/nodemailer.js");
const path = require("path");

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT;
const HOST = process.env.HOST;

async function registerUser(req, res) {
  try {
    //Fetching all requests
    const { fullName, rollNumber, email, password, confirmPassword } = req.body;

    if (!fullName || !rollNumber || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password != confirmPassword) {
      return res.status(409).json({
        success: false,
        message: "Password do not matched.",
      });
    }
    
    const User = await user.findOne({ email });
    
    if (User) {
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }
    
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const verifyURL = `http://${HOST}:${PORT}/api/auth/verify-email?token=${emailVerificationToken}`;
    const emailVerificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24hr
    // Hashing Password
    const hashPassword = await bcrypt.hash(password, 10);
    
    const newUser = new user({
      fullName: fullName,
      rollNumber: rollNumber,
      email: email,
      role: "student",
      password: hashPassword,
      emailVerificationToken,
      emailVerificationTokenExpire,
    });
    
    // Saving newUser to DB
    await newUser.save();
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0;padding:0;background-color:#f8f9fa;font-family:Arial, Helvetica, sans-serif;">

  <div style="width:100%;padding:30px 15px;background-color:#f8f9fa;">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#3498db,#2980b9);color:#ffffff;padding:25px;text-align:center;">
        <h1 style="margin:0;font-size:24px;">📚 LibraTech</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;color:#2c3e50;line-height:1.6;">
        <h2 style="margin-top:0;font-size:20px;">Verify your email address</h2>

        <p>
          Hi <strong>${fullName.split(" ")[0]}</strong>,
        </p>

        <p>
          Thank you for registering with <strong>LibraTech Library Management System</strong>.
          Please confirm your email address to activate your account.
        </p>

        <p style="text-align:center;">
          <a
            href="${verifyURL}"
            target="_blank"
            style="display:inline-block;margin:30px 0;padding:14px 28px;background-color:#3498db;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:8px;"
          >
            Verify Email
          </a>
        </p>

        <p>
          If the button doesn't work, copy and paste this link into your browser:
        </p>

        <p style="word-break:break-all;color:#3498db;font-size:14px;">
          ${verifyURL}
        </p>

        <p>
          This link will expire in <strong>24 hours</strong>.
        </p>

        <p>
          If you didn't create this account, you can safely ignore this email.
        </p>

        <p>
          Regards,<br />
          <strong>LibraTech Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:20px 30px;background-color:#e9ecef;font-size:14px;color:#6c757d;text-align:center;">
        © 2026 LibraTech • Library Management System<br />
        This is an automated email. Please do not reply.
      </div>

    </div>
  </div>

</body>
</html>
`

    const mailOption = {
      to : email,
      subject : "LibraTech Email Verification",
      html
    }

    await sendMail(mailOption);

    return res.status(201).json({
      success: true,
      message: "User created SuccessFully, Please verify your email!",
    });
  } catch (err) {
    res.status(500).json({ error: err });
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
        err: "User do not exists",
      });
    }
    if (!User.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Email not verified",
        err: "Email not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, User.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password do not match",
        err: "Password do not match",
      });
    }

    const token = jwt.sign(
      {
        _id: User._id,
        role: User.role,
      },
      SECRET_KEY,
      { expiresIn: "60m" },
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

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    const User = await user.findOne({
      emailVerificationToken : token,
      emailVerificationTokenExpire: { $gt: Date.now() },
    });

    if (!User) {
      return res.redirect("/pages/emailUnverified.html");
    }

    User.isVerified = true;

    await User.save();

    return res.redirect("/pages/emailVerified.html");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { registerUser, login, verifyEmail};
