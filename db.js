const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;
const collections = {};

async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db('bon_rewards');
  collections.users = db.collection('users');
  collections.bills = db.collection('bills');
  collections.rewards = db.collection('rewards');
  console.log('MongoDB connected');
  return db;
}

async function insertIntoDB(collectionName, doc) {
  if (!db) await connectDB();
  if (!doc.identifier) {
    doc.identifier = uuidv4();
  }
  const collection = collections[collectionName];
  const result = await collection.insertOne(doc);
  return result;
}

async function updateDB(collectionName, filter, updateDoc) {
  if (!db) await connectDB();
  const collection = collections[collectionName];

  // If filter references 'identifier' string, no transform needed
  const result = await collection.updateOne(filter, updateDoc);
  return result;
}

async function findInDB(collectionName, filter, options = {}) {
  if (!db) await connectDB();
  const collection = collections[collectionName];
  let cursor = collection.find(filter);
  if (options.limit) cursor = cursor.limit(options.limit);
  if (options.sort) cursor = cursor.sort(options.sort);
  return cursor.toArray();
}

async function findOneInDB(collectionName, filter) {
  if (!db) await connectDB();
  const collection = collections[collectionName];
  return collection.findOne(filter);
}

module.exports = {
  connectDB,
  insertIntoDB,
  updateDB,
  findInDB,
  findOneInDB,
  uuidv4: uuidv4,
};
