import express from "express";
import cors from "cors";
import compression from "compression";
import { json } from "body-parser";
import { patchRouterParamForAsyncHandling } from "./utils";
import { questionsRoutes, authRoutes, testRoutes, reportRoutes } from "./routes";
import { constants } from "@yahalom-tests/common";
import { authMiddleware, errorMiddleware, notFoundMiddleware } from "./middleware";
import "reflect-metadata";

patchRouterParamForAsyncHandling();
const app = express();

app.use(cors());
app.use(json());
app.use(compression());

app.use("/questions", authMiddleware, questionsRoutes);
app.use("/auth", authRoutes);
app.use("/test", authMiddleware, testRoutes);
app.use("/reports", authMiddleware, reportRoutes);
app.use("*", notFoundMiddleware);
app.use(errorMiddleware);

const { serverDomain, serverPort } = constants.URLS;

app.listen(serverPort, () =>
    console.log(`YahalomTests server is running at ${serverDomain}:${serverPort}`)
);
