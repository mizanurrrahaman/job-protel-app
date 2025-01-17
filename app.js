import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import { connection } from "./database/connection.js";
import cors from "cors";
import { errorMiddleware } from "./middlerwares/error.js";
import fileUpload from "express-fileupload";
import userRouter from "./route/userRouter.js"
import jobRouter from "./route/jobRouter.js"
import applicationRouter from "./route/applicationRouter.js"
import { newsLetterCron } from "./automation/newsLetterCron.js";

const app = express()

config({path: "./config/config.env" })

app.use(cors({
    origin:[process.env.FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})

);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use(fileUpload({

    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter)
app.use("/api/v1/job", jobRouter)
app.use("/api/v1/application", applicationRouter)


newsLetterCron()
connection()
app.use(errorMiddleware)


export default app;


//murad1414
//7V7XpCfBUl3GWm6X