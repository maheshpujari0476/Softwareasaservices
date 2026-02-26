import express from "express";
const router = express.Router();
import {
  registerController,
  loginController,
  logoutController,
  allController,
  refreshController,
  getUsersControllers,
} from "../controllers/usercontrollers.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { authLimiter }  from "../middlewares/ratelimiter.middleware.js";

const limiter = process.env.NODE_ENV !== "test" ? authLimiter : (req, res, next) => next();

router.get("/", (req, res) => {
  return res.json({ message: "hi from backend for advance backend" });
});
router.post("/register",limiter, registerController);

router.post("/login", limiter , loginController);
// router.post('/login',login)
router.get("/allusers", allController);

router.get("/profile", limiter, authMiddleware, (req, res) => {
  return res.json({ message: "This is protected route", data: req.user });
});

router.get("/logout", authMiddleware, limiter, logoutController);

router.get("/refreshtoken", refreshController);

router.get("/users", limiter, getUsersControllers);

export { router };
