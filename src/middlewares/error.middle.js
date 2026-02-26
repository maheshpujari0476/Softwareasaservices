export const errorHandler = (err,req,res,next)=>{
    console.error(err);

  // if (err.code === "23505" && err.constraint === "users_email_key") {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Email already exists",
  //   });
  // }


  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.staus(status).json({
    success: false,
    message,
  });
}
