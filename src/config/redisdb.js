import { createClient } from "redis";


// used to connect to redis db 
export const redisclient = createClient({
    url: process.env.REDIS_URL,
})
 
redisclient.on('connect',()=>{
    console.log("redis connected")
})

redisclient.on('error',(err)=>{
  console.error("Redis error",err);
})

// await redisclient.connect();
if (process.env.NODE_ENV !== "test") {
  await redisclient.connect();
}