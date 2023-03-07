import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter"
import userRouter from "./routers/userRouter"
import videoRouter from "./routers/videoRouter"
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
import helmet from "helmet";


const app = express();
const logger = morgan("dev");

app.set("view engine", "pug") //view engine을 pug로 한다고 알려줌
app.set("views", process.cwd() + "/src/views") //default로 설정된 위치에서 바꿔줌
app.use(logger);
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
//initialize session before routers
app.use(
    session({ //session middleware - 사이트로 들어오는 모두를 기억
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL })
        //세션들을 MongoDB database에 저장함
    })
)

app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

app.use(flash())
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"))
app.use("/", rootRouter); //default export 이기 때문에 어떤 이름을 선택하든 상관x
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;