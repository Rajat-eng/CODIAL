const mongoose = require('mongoose');
const env=require('./environment');
main().catch(err => console.log("Cannot run database"));

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/${env.db}`);
  console.log("Database successfully accessed");
}
const db=mongoose.connection;

module.exports=db;


