import express from "express";
import {
  getSchemeRecommendations,
  getLoanRecommendations,
} from "../controllers/recommendController.js";

const router = express.Router();

// NOTE: These endpoints return specific lists
router.post("/schemes", getSchemeRecommendations);
router.post("/loans", getLoanRecommendations);

export default router;
