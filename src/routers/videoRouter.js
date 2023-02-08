import express from "express";
import { see, edit, deleteVideo, upload } from "../controllers/videoController";
const videoRouter= express.Router();

videoRouter.get("/upload",upload) //id로 인식될까봐 가장 위에 둬야 함!
videoRouter.get("/:id(\\d+)",see)
videoRouter.get("/:id(\\d+)/edit",edit)
videoRouter.get("/:id(\\d+)/delete",deleteVideo)

export default videoRouter