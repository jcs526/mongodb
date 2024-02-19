
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

app.get("/", async (req, res) => {
  const mongoData = await getMongoData();
  res.send(mongoData);
});

app.get("/:id", async (req, res) => {
  debugLog(
    "Hello world"
  );

  const mongoData = await getMongoData(req.params.id);
  res.send(mongoData);
});

app.listen(port, function () {
  debugLog(
    "Express server has started on port " + port + ", Service List=>"
  );
});

const getMongoData = async (id = "") => {
  // MongoDB 연결 문자열
  const collection = await connectMongoDB(); // MongoDB에 연결

  try {
    // MongoDB에 연결\
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

/**
  MODE=dev
  DEBUG=app:debug
  MONGO_URL = "mongodb://127.0.0.1:27017"
  DB_NAME = "shop"
  COLLECTION_NAME = "products"
 */
async function connectMongoDB() {
  const url = process.env.MONGO_URL;

  // MongoDB 데이터베이스 이름
  const dbName = process.env.DB_NAME;
  const collectionName = process.env.COLLECTION_NAME;

  // 연결할 클라이언트 생성
  const client = new MongoClient(url);
  await client.connect(); // MongoDB에 연결


  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  return collection;
}
