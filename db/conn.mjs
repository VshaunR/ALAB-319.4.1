import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

//create connection string
let connectionString = process.env.atlasURI || '';

const client = new MongoClient(connectionString);
//create variable to collect connection info
let conn;

try {
  conn = await client.connect();
  console.log(`Mongodb is connected`)
} catch (e) {

}
let db = conn.db('sample_training');


export default db;