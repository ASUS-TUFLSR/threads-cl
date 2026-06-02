import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import {getMessages, sendMessage} from "../controllers/messageController.js"

const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/:otherUserId", protectRoute, getMessages);

export default router;