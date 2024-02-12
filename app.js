
const express = require("express");
const morgan = require("morgan");

require("dotenv").config();

const debug = require("debug");
const debugLog = debug("app:debug");
debugLog("This is a debug message");

const port = 21352;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(morgan("combined"));
const fs = require("fs");
const path = require("path");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/*", (req, res)=>{
  debugLog(
    "Hello world"
  );
  res.send("Hello world");
});

app.listen(port, function () {
  debugLog(
    "Express server has started on port " + port + ", Service List=>"
  );
});