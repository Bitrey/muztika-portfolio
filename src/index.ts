// Utilities
import path from "path";
import fs from "fs";

// Express
import express from "express";

// Routes
import appRoutes from "./routes/appRoutes";

// Env
import dotenv from "dotenv";

// Body parser
import bodyParser from "body-parser";

// Initialize dotenv
dotenv.config();

// DB
import "./config/database";

// Initialize Express
const app = express();

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use EJS
app.set("view engine", "ejs");

// Set view folder
app.set("views", path.join(__dirname, "/views"));

// Serve static files
app.use(express.static(path.join(__dirname, "..", "/public")));

// Use routes
app.use("/", appRoutes);

// Start server
const PORT = Number(process.env.PORT) || 3000;
const IP = process.env.IP || "127.0.0.1";
app.listen(PORT, IP, () => console.log("Server started on port " + PORT));

// Instagram
const Instagram = require("instagram-web-api");
const { username, password } = process.env;

const client = new Instagram({ username, password });

const fetchPhotos = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!client) reject();
            const profile = await client.getPhotosByUsername({
                username: "muz.art_"
            });

            const urls: string[] = [];
            profile?.user?.edge_owner_to_timeline_media?.edges?.forEach(
                (e: any, i: number) => urls.push(e?.node?.thumbnail_src)
            );

            if (urls.length > 0) return resolve(urls);
            else reject();
        } catch (err) {
            console.error(err);
            reject();
        }
    });
};

let photosURL: string[] = [];
export const getPhotosURL = (): string[] => {
    if (!photosURL.length && photosURLFile.length) {
        photosURL = photosURLFile;
    }
    return photosURL;
};

const PHOTOS_URL_PATH = path.join(
    __dirname,
    "..",
    "/photosDB",
    "photosURL.json"
);

const photosURLFile = require(PHOTOS_URL_PATH);

const loginAndFetch = async (doLogin: boolean) => {
    try {
        doLogin ? await client.login() : null;
        console.log("Instagram login successful");
        photosURL = await fetchPhotos();
        if (photosURL.length > 0) {
            fs.writeFileSync(PHOTOS_URL_PATH, JSON.stringify(photosURL));
        }
    } catch (err) {
        console.error("Instagram login failed, " + err);
        if (photosURL.length === 0) {
            photosURL = JSON.parse(photosURLFile);
        }
    }
};

(async () => {
    try {
        // DEBUG
        await loginAndFetch(false);
        // await loginAndFetch(true);
    } catch (err) {
        await loginAndFetch(false);
    }
})();

const schedule = require("node-schedule");

const fetchPhotosTask = schedule.scheduleJob("00 * * * *", async () => {
    try {
        photosURL = await fetchPhotos();
    } catch (err) {
        console.error("Instagram photo fetch failed, ", err);
        if (photosURL.length === 0) {
            photosURL = JSON.parse(photosURLFile);
        }
    }
});
