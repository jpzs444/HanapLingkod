const nodemailer = require("nodemailer");
require("dotenv").config();

async function BookingEmail(subject, text, email) {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USR,
      pass: process.env.EMAIL_APP_PWD,
    },
  });
  transporter
    .sendMail({
      from: process.env.EMAIL_USR, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    })
    .then((info) => {
      console.log({ info });
    })
    .catch(console.error);
}

module.exports = BookingEmail;
