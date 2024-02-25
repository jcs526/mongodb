
const express = require("express");
const morgan = require("morgan");

require("dotenv").config();

const debug = require("debug");
const debugLog = debug("app:debug");
debugLog("This is a debug message");

const fs = require("fs");
const path = require("path");

const { MongoClient, ObjectId } = require("mongodb");

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
  if(!db){
    const url = process.env.MONGO_URL;
    // 연결할 클라이언트 생성
    db = new MongoClient(url, { minPoolSize:10 });
    
    await db.connect(); // MongoDB에 연결
  }
  
 

  // MongoDB 데이터베이스 이름
  const dbName = process.env.DB_NAME;
  const collectionName = process.env.COLLECTION_NAME;

  const database = db.db(dbName);
  const collection = database.collection(collectionName);

  return collection;
}
