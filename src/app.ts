import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import v1Router from "./v1/router.v1";

import { errorHandler } from "./middlewares/errorHandler.middleware";
import { connectRedis } from "utils/cache";

const app = express();


connectRedis()

/**
 *@description express configuration
 */

app.use(cors());
app.set("trust proxy", true);

app.use(logger("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: false, limit: "500mb" }));
app.use(cookieParser());

/**
 * v1 Router
 */

app.use("/api", v1Router);

/**
 * 404 error handler
 */

app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * general error handler
 */

app.use(errorHandler);

export default app;
