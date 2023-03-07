import express from "express";
import { watch, getEdit, getUpload, deleteVideo, postEdit, postUpload } from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";
const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch)
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit)
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo)
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.fields([
    //두 개의 객체(썸네일, 비디오)가 들어갈 배열이 필요!
    { name: "video", maxCount: 1 }, { name: "thumb", maxCount: 1 }
    //fields를 쓰면 req.file 대신 req.files를 사용
]), postUpload)

//로그인 되어있을 때만 설정 가능하도록 protect
//나중에, 각 비디오가 어떤 user에 의해 업로드되었는지 알려줄거임
export default videoRouter 