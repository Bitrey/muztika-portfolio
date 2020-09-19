import mongoose from "mongoose";

const { MONGOOSE_URI } = process.env;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

if (typeof MONGOOSE_URI !== "string") {
    console.error("No MONGOOSE_URI env!");
    process.exit(1);
}

mongoose.connect(MONGOOSE_URI, err =>
    err ? console.error(err) : console.log("Connected to MongoDB")
);
