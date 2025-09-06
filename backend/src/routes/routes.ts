import express from "express";
import authRouter from "./v1/auth.js";
import contentRouter from "./v1/contentRoutes.js";
import linkShareRouter from "./v1/shareLinkRouter.js";
import tagRouter from "./v1/tagRouter.js";


const v1Router = express.Router();

v1Router.use("/auth",authRouter)
v1Router.use("/content",contentRouter)
v1Router.use("/brain",linkShareRouter)
v1Router.use("/tags", tagRouter)

export default v1Router;