import express from "express";
import {join, login} from "../controllers/userController"
import {trending, search} from "../controllers/videoController"

const globalRouter = express.Router();

const handleHome =(req,res) =>{res.send("Home")}
const handleJoin=(req,res) =>res.send("Join")


globalRouter.get("/",trending)
globalRouter.get("/join",join)
globalRouter.get("/login",login)
globalRouter.get("/search",search)



export default globalRouter
//export 해서 다른 파일들에서도 import를 통해 사용가능하도록 함