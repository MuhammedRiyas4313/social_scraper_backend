import express from "express";
import { analyze, scrape } from "v1/controllers/index.controller";

const router = express.Router();

router.post("/scrape", scrape);
router.post("/analyze", analyze);

export default router;
