import statsRoutes from "./routes/statsRoutes.js";
import express from "express";
import userRoutes from "./routes/User.js";
import { connectDb } from "./config/Db.js";
import cors from "cors";
import propertRoute from "./routes/properties.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import useTenants from "./routes/tenant.js";
import useContractor from "./routes/Contractor.js";
import usemantaintence from "./routes/maintainance.js";


dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dezn9ks7m",
  api_key: "794856256614523",
  api_secret: "6eQ478PGYijJopvSBdzjcSiloqw",
});

const uploadResult = await cloudinary.uploader.upload(
  "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
  { public_id: "property" }
);
const port = 3000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());

// Use defined routes

app.use("/api", userRoutes);
app.use("/api", propertRoute);
app.use("/api", useTenants);
app.use("/api", useContractor);
app.use("/api", usemantaintence);
app.use("/api", usemantaintence);
app.use("/api", statsRoutes);

app.use("/api", userRoutes);
app.use("/api", propertRoute);
app.use("/api", useTenants);
app.use("/api", useContractor);
app.use("/api", usemantaintence);

app.listen(port, () => {
  connectDb("mongodb://localhost:27017/Node-js");
  console.log(`Server is running on port ${port}`);
});
