import jwt from "jsonwebtoken";
import argon2 from "argon2";
import {
  createUser,
  findUserByEmail,
  Allusers,
  getUsers,
} from "../services/userservice.js";
import { generateToken, refreshToken } from "../utils/jwt.js";
import { redisclient } from "../config/redisdb.js";
import { pool } from "../config/db.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // console.log(name,email,password)
    if (!name || !email || !password)
      throw { status: 400, message: "All feilds are required" };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // console.log(name, email, password);
    if (!emailPattern.test(email))
      throw { status: 400, message: "Email format is wrong" };

    const passpattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // console.log(name, email, password);
    if (passpattern.test(password))
      throw {
        status: 401,
        message:
          "Password must be 8+ chars with upper, lower, number, special char",
      };

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw { status: 402, message: "email already exist" };

    const user = await createUser(name, email, password);

    return res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw { status: 400, message: "All feilds are required" };

  const user = await findUserByEmail(email);
  if (!user) throw { status: 402, message: "user not found" };

  const isMatch = await argon2.verify(user.password, password);
  if (!isMatch) throw { status: 401, message: "Invalid Credentials" };

  const token = await generateToken({ id: user.id, email: user.email });

  const refreshtoken = await refreshToken({ id: user.id, email: user.email });

  //store session on redis
  await redisclient.set(`session:${user.id}`, token, { EX: 60 * 60 });
  await redisclient.set(`refresh:${user.id},`, refreshtoken, {
    EX: 7 * 24 * 60 * 60,
  });
  //set cookie to browser
  res.cookie("token",token,{
    httpOnly: true,
    secure: false, //true in production HTTPS
    smaeSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refresh", refreshtoken, {
    httpOnly: true,
    secure: false, //true in production HTTPS
    smaeSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res.status(201).json({ message: "login successfully"});
};

export const allController = async (req, res) => {
  const allusers = await Allusers();
  if (!allusers) throw { status: 404, message: "Internal Server Error" };
  return res.status(201).json({ data: allusers });
};



export const logoutController = async (req, res) => {
  const user = req.user.id; // from auht middleware
  if (!user) throw { status: 404, message: "Internal server Error" };

  //delete sesion from redis
  await redisclient.del(`session:${user.id}`);

  // delete cookie from browser
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};



export const refreshController = async (req, res, err) => {
  try {
    const token = req.cookies.refreshToken;

    const decoded = jwt.verify(token, JWT_REFRESHKEY);

    const stored = await redisclient.get(`refresh${decoded.id}`);

    if (!stored || stored !== token) throw new Error("Invalid refresh token");

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.envenv.JWT_SECRETKEY,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, { httpOnly: true });
    res.json({ message: "Access token created succfully" });
  } catch (err) {
    next(err);
  }
};



export const getUsersControllers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const users = await getUsers(page, limit);
    res.status(201).json({
      success: true,
      page,
      limit,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};
