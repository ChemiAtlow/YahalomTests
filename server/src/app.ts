import express from "express";
import cors from "cors";
import compression from "compression";
import { json } from "body-parser";
import { patchRouterParamForAsyncHandling } from "./utils";
import { questionsRouter, authRouter, testRoutes, examRoutes } from "./routes";
import { constants } from "@yahalom-tests/common";
import { authMiddleware, errorMiddleware, notFoundMiddleware } from "./middleware";
import "reflect-metadata";

patchRouterParamForAsyncHandling();
const app = express();

app.use(cors());
app.use(json());
app.use(compression());

app.use("/questions", authMiddleware, questionsRouter);
app.use("/auth", authRouter);
app.use("/test", authMiddleware, testRoutes);
app.use("/exam", examRoutes);
app.use("*", notFoundMiddleware);
app.use(errorMiddleware);

const { serverDomain, serverPort } = constants.URLS;

app.listen(serverPort, () =>
    console.log(`YahalomTests server is running at ${serverDomain}:${serverPort}`)
);
