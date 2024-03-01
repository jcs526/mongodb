
const express = require("express");
const morgan = require("morgan");

require("dotenv").config();

const debug = require("debug");
const debugLog = debug("app:debug");
debugLog("This is a debug message");

const fs = require("fs");
const path = require("path");

//eslint-disable-next-line
const { MongoClient, ObjectId, Db, Collection } = require("mongodb");
const connectMongoDB = require("./dbClient");


let db;


const port = 21352;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/mongodb", async (req, res) => {
  const mongoData = await getMongoData();
  res.send(mongoData);
});

app.get("/mongodb/:id", async (req, res) => {
  const mongoData = await getMongoData(req.params.id);
  res.send(mongoData);
});

app.post("/mongodb", async (req, res) => {
  const mongoData = await insertMongoData(req.body);
  res.send(mongoData);
});

// 404 Not Found 처리
app.use((req, res) => {
  res.status(404).send("Sorry, that route does not exist.");
});

// 서버 내부 오류 처리
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, function () {
  debugLog(
    "Express server has started on port " + port + ", Service List=>"
  );
});

const getMongoData = async (id = "") => {
  // MongoDB 연결 문자열
  const collection = await connectCollection(); // MongoDB에 연결

  try {
    const query = {};
    if (id) {
      query._id = new ObjectId(id);
    }
    const result = await collection.find(query).toArray();
    debugLog(query, result);
    return result;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    return [];
  }

};
const insertMongoData = async data => {
  // MongoDB 연결 문자열
  const collection = await connectCollection(); // MongoDB에 연결

  try {
    const result = await collection.insertOne(data);
    debugLog(data, result);
    return result;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    return [];
  }

  console.log(
    "data", data
  );

};

/**
  MODE=dev
  DEBUG=app:debug
  MONGO_URL = "mongodb://127.0.0.1:27017"
  DB_NAME = "shop"
  COLLECTION_NAME = "products"
 */

/**
 * 
 * @returns {Collection}
 */
async function connectCollection() {
  const database = await connectMongoDB();

  const collectionName = process.env.COLLECTION_NAME;
  const collection = database.collection(collectionName);

  return collection;
}
