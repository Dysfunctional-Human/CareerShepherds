import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { updateUser } from "../controllers/userControllers.js";

const router = express.Router();

router.put("/update", protectRoute, updateUser);
router.get("/me", protectRoute, (req, res) => {
    res.send(req.user);
});
export default router;