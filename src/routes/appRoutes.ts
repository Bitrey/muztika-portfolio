import { Request, Response, Router } from "express";
import { getPhotosURL } from "..";

import emailValidator from "email-validator";
import transporter from "../shared/nodemailer";

import Commission, { CommissionClass } from "../models/Commission";

import bcrypt from "bcryptjs";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("index");
});

router.get("/get-photos", (req: Request, res: Response) => {
    const photosURL = getPhotosURL();
    res.send(photosURL);
});

router.post("/commission", async (req: Request, res: Response) => {
    const { email, body } = req.body;
    if (
        !emailValidator.validate(email) ||
        typeof body !== "string" ||
        body.length < 30 ||
        body.length > 1000
    ) {
        // Bad request
        res.sendStatus(400);
    } else {
        // OK
        res.sendStatus(200);

        // Create new commission in DB
        const commission = new Commission({ email, body });

        // Notify Muztika about new order
        const message = {
            from: `"Bitrey Email System" ${process.env.SEND_EMAIL_FROM}`,
            to: process.env.SEND_EMAIL_TO,
            subject: "NUOVO CONTATTO PORTFOLIO!!",
            html:
                `Michelino!<br>` +
                `Sei stato contattato da <a href="mailto:${email}">${email}</a> tramite il tuo sito!<br><br>` +
                `********** CORPO RICHIESTA **********<br>` +
                body +
                `<br>********** FINE CORPO RICHIESTA **********<br>` +
                `<br>Vedi di rispondere presto (<strong>SENZA RISONDERE A QUESTA MAIL</strong> ma cliccando sull'indirizzo scritto sopra).`
        };

        transporter.sendMail(message, (err, info) => {
            if (err) return console.error(err);
            console.log("New email sent!");
        });

        await commission.save();
    }
});

router.get("/commission", (req: Request, res: Response) =>
    res.render("commission")
);

const { ADMIN_PASSWORD_HASH } = process.env;
if (typeof ADMIN_PASSWORD_HASH !== "string") {
    console.error("No ADMIN_PASSWORD_HASH env!");
    process.exit(1);
}

const { toBase64 } = require("hex64");

router.get("/get-commissions", async (req: Request, res: Response) => {
    const { password } = req.query;
    if (typeof password !== "string") {
        return res.sendStatus(401);
    } else if (
        bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
        // || bcrypt.compareSync(
        //     password,
        //     "$2a$10$iFDPubmqZ9XEpDBHzOXKy.n5RpZurGpNnusnnj4uTXZtT//mL3Bk2"
        // )
    ) {
        const commissions = await Commission.find({}).exec();
        // commissions.forEach(
        //     (elem: any) => (elem.idBase64 = toBase64(elem._id.toString()))
        // );
        // console.log(commissions);
        return res.json(commissions);
    } else {
        return res.sendStatus(401);
    }
});

// router.get("/set-password", async (req: Request, res: Response) => {
//     res.render("setPassword");
// });

// router.post("/set-password", async (req: Request, res: Response) => {
//     const password = req.body["admin-password"];
//     const salt = bcrypt.genSaltSync();
//     const hash = bcrypt.hashSync(password, salt);
//     console.log({ hash, salt });
//     res.sendStatus(200);
// });

router.get("*", (req: Request, res: Response) => res.redirect("/"));

export default router;
