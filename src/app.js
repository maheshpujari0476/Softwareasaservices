import express from "express"
import colors from "colors"
import helmet from "helmet";
import cors from "cors"
import cookieParser from "cookie-parser";
import {router} from "./routes/userroute.js"
import { errorHandler } from "./middlewares/error.middle.js";
// import { authLimiter } from "./middlewares/ratelimiter.middleware.js"
import morgan from "morgan";
const app = express();
import fs from "fs";
import path from "path";
// import morgan from "morgan";

 const logger = (req, res, next) => {
   const colormethod = {
     GET: "green",
     POST: "blue",
     PUT: "yellow",
     DELETE: "red",
   };
   const color = colormethod[req.method] || white;
   const message = `${req.method} ${req.protocol}://${req.get("host")}${
     req.originalUrl
   }`;
   console.log(message[color]);
   next();
 };


const logstream = fs.createWriteStream(
    path.join("logs", "access.log"), 
    {
  flags: "a",
});


// app.use(morgan('combined'))
app.use(morgan('dev'))
app.use(morgan("combined", { stream: logstream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);
app.use(helmet())
app.use(cors({
    credentials:true,
    origin:true,
}));
app.use(logger);
app.use(cookieParser())
// if (process.env.NODE_ENV !== "test") {
//   app.use(authLimiter);
// }


app.use('/api/auth',router);
export {
    app,
}