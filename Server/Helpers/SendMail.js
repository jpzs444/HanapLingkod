const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(subject, text, email) {
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
      from: email, // sender address
      to: process.env.EMAIL_USR, // list of receivers
      subject: subject, // Subject line
      text: text + "\n from " + email, // plain text body
    })
    .then((info) => {
      console.log({ info });
    })
    .catch(console.error);
}

module.exports = sendEmail;
