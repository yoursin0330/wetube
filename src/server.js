import "./db"; //파일 그 자체를 import
import "./models/Video";
import express from "express";
import morgan from "morgan";

import global from "./routers/globalRouter"
import user from "./routers/userRouter"
import video from "./routers/videoRouter"

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug") //view engine을 pug로 한다고 알려줌
app.set("views", process.cwd() + "/src/views") //default로 설정된 위치에서 바꿔줌
app.use(logger);
app.use(express.urlencoded({ extended: true }))

app.use("/", global); //default export 이기 때문에 어떤 이름을 선택하든 상관x
app.use("/users", user);
app.use("/videos", video);

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)