import express from "express";
const router = express.Router();
import multer from "multer";
import { fileUpload, parseResume, checkResume } from "../controllers/resumeControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/upload", protectRoute,upload.single('pdf_file'),fileUpload);
router.get("/parse",protectRoute,parseResume);
router.post("/check",protectRoute,checkResume);

export default router;