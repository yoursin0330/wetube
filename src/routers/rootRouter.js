import express from "express";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController"
import { home, search } from "../controllers/videoController"
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();


rootRouter.get("/", home)
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin)
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin)
rootRouter.get("/search", search)


export default rootRouter;
//export 해서 다른 파일들에서도 import를 통해 사용가능하도록 함