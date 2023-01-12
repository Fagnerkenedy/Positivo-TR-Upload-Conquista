require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

app.use(cors());

// set the view engine to ejs
app.set("view engine", "ejs");

// Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(fileUpload());

// Routes
app.use("/", require("./routes"));

// Static folder
//app.use("/public", express.static("public"));

server.listen(process.env.EXPRESS_PORT);
console.log(`Server has initiated - on Port ${process.env.EXPRESS_PORT}`);
