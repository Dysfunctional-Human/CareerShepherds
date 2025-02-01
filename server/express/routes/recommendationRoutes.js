import { protectRoute } from "../middleware/protectRoute.js";
import {getRecommendations,getExplicitRecommendations} from "../controllers/recommendationController.js";
import router from "./userRoutes.js";
router.get('/',protectRoute, getRecommendations);
router.post('/explicit',protectRoute, getExplicitRecommendations);
export default router;