import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { redisclient } from '../config/redisdb.js'



// let authLimiter;
// if () {
//   // Dummy middleware for tests
  
// }

//   else{
//   const authLimiter = 
//   }

//   export const authLimiter = process.env.NODE_ENV === "test" ? (req, res, next) => next() : rateLimit({
//   windowMs: 60 * 1000,
//   max: 5,
//   standardHeaders: true,
//   legacyHeaders: false,

//   store:new RedisStore({
//    sendCommand:(...args)=> redisclient.sendCommand(args),
//   }),

//   message: {
//     success: false,
//     message: "Too many attempts. try again after 1 minute",
//   },
// });

let authLimiter;

if (process.env.NODE_ENV === "test") {
  authLimiter = (req, res, next) => next();
} else {
  authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redisclient.sendCommand(args),
    }),
    message: {
      success: false,
      message: "Too many attempts. try again after 1 minute",
    },
  });
}

export { authLimiter };


