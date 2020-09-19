import nodemailer from "nodemailer";

// Initialize dotenv
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((err, success): void => {
    if (err) {
        console.error(err);
    } else {
        console.log("Email working: " + success);
    }
});

export default transporter;
