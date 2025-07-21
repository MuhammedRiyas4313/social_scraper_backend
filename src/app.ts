import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import v1Router from "./v1/router.v1";

import { errorHandler } from "./middlewares/errorHandler.middleware";
import { CONFIG } from "common/config.common";

const app = express();

/**
 * @description mongo connection and seeder
 */

mongoose
  .connect(CONFIG.MONGOURI)
  .then(() => console.log("DB Connected to ", CONFIG.MONGOURI))
  .catch((err) => console.error(err));

mongoose.set("debug", true);
mongoose.set("allowDiskUse", true);

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
