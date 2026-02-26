// import express from "express";
import dotenv from "dotenv";
// import bodyParser from "body-parser";
import colors from "colors";
// import { router } from "../productiongradeauth/src/routes/userroute.js";
import { app } from "./src/app.js";
dotenv.config({ quiet: true });
import { pool } from "./src/config/db.js";



const port = process.env.PORT || 2000;



pool.connect()
.then(()=>{
console.log("postgre sql connected");

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

}).catch((error)=>{
  console.error({error:error.mesage})
  console.error("DB connection failed")
})


