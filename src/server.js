import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter"
import userRouter from "./routers/userRouter"
import videoRouter from "./routers/videoRouter"

const PORT = 4000;

const app=express();
const logger = morgan("dev");

app.set("view engine","pug")
app.use(logger);
app.use("/",globalRouter); //default export 이기 때문에 어떤 이름을 선택하든 상관x
app.use("/users",userRouter);
app.use("/videos",videoRouter);
 
const handleListening=()=>console.log(`Server listening on port ${PORT} 🚀`)
app.listen(PORT,handleListening)