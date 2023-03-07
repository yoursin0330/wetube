import express from "express";
import { registerView, createComment } from "../controllers/videoController";
const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView)
//여기에 post 요청을 보내면 조회수를 기록하게 만들어줌
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment)

export default apiRouter;