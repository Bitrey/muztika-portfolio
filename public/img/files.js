const fs = require("fs");
const path = require("path");

const BASE_PATH = __dirname + "/";
const renameFiles = () => {
    const files = fs.readdirSync(BASE_PATH);
    files.reverse();
    renameLoop(files);
    console.log("done");
};
const renameLoop = fileArray => {
    const newFileNames = [];
    fileArray.forEach(fileName => {
        const oldPath = path.join(BASE_PATH, fileName);
        const extention = path.extname(oldPath);
        if (extention !== ".js") {
            const randomString =
                Date.parse(new Date()) + Math.round(Math.random() * 100000);
            const newPath = path.join(BASE_PATH, randomString + extention);

            fs.renameSync(oldPath, newPath);
            newFileNames.push(path.basename(newPath));
        }
    });

    newFileNames.forEach((fileName, i) => {
        const extention = path.extname(BASE_PATH + fileName);
        if (extention !== ".js") {
            const oldPath = path.join(BASE_PATH, fileName);
            const newPath = path.join(BASE_PATH, i + extention);

            if (!fs.existsSync(newPath) && fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
            }
        }
    });
};
renameFiles();
