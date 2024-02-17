
const express = require("express");
const morgan = require("morgan");

require("dotenv").config();

const debug = require("debug");
const debugLog = debug("app:debug");
debugLog("This is a debug message");

const { MongoClient, ObjectId } = require("mongodb");


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

app.get("/*", async (req, res) => {
  debugLog(
    "Hello world"
  );

  await getMongoData();
  res.send("Hello world2");
});

app.listen(port, function () {
  debugLog(
    "Express server has started on port " + port + ", Service List=>"
  );
});

const getMongoData = async () => {
  // MongoDB 연결 문자열
  const url = "mongodb://127.0.0.1:27017";

  // MongoDB 데이터베이스 이름
  const dbName = "shop";
  const collectionName = "products";

  // 연결할 클라이언트 생성
  const client = new MongoClient(url);
  //mongodb+srv://test:passw0rd@cluster0.fpm4bdi.mongodb.net/
  await client.connect(); // MongoDB에 연결

  try {
    // MongoDB에 연결
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.find().toArray();
    console.log(result);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
  
};

async function connectDB(client, dbName) {
  try {
    // MongoDB에 연결
    console.log("dd");
    await client.connect();
    console.log("Connected to MongoDB");

    // 데이터베이스 가져오기
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}