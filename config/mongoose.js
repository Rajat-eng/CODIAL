const mongoose = require('mongoose');

main().catch(err => console.log("Cannot run database"));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/codeial_development');
  console.log("Database successfully accessed");
}
const db=mongoose.connection;

module.exports=db;


