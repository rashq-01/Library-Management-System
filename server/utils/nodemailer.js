const nodemailer = require("nodemailer");

async function sendMail({to,subject,html}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from : `"LibraTech" <${process.env.EMAIL}>`,
    to,
    subject,
    html
  });
  console.log("email sent");
}

module.exports = sendMail;