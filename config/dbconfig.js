require("dotenv").config();
const {Client} = require('pg');

const client = new Client({
    host : "localhost",
    port : 5432,
    user :"postgres",
    password: "postgres",
    database : "ecom"
});

client.on("connect",()=>{
    console.log("DATABASE IS CONNECTED");
});
client.on("disconnect",()=>{
    console.log("Database is DISCONNECTED");
})

module.exports = client;




