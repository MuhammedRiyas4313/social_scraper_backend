import express from "express";

import indexRouter from "v1/routes/index.routes";

const router = express.Router();

router.use("/v1", indexRouter);

export default router;
