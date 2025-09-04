import express from "express";
import authRouter from "./v1/auth.js";
import contentRouter from "./v1/contentRoutes.js";


const v1Router = express.Router();

v1Router.use("/auth",authRouter)
v1Router.use("/content",contentRouter)

export default v1Router;