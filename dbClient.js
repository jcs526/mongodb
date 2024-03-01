// dbClient.js
const { MongoClient, Db } = require("mongodb");
require("dotenv").config();

let db;

/**
 * 
 * @returns {Db}
 */
async function connectMongoDB() {
  if (!db) {
    const url = process.env.MONGO_URL;
    db = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await db.connect();
  }

  const dbName = process.env.DB_NAME;
  return db.db(dbName);
}

module.exports = connectMongoDB;