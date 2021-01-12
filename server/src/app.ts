import express from "express";
import cors from "cors";
import compression from "compression";
import { json } from "body-parser";

import { questionsRouter } from "./routes";
import { URLS } from "./constants/";
import { errorMiddleware, notFoundMiddleware } from "./middleware";

const app = express();

app.use(cors());
app.use(json());
app.use(compression());

app.use("/api/Questions", questionsRouter);
app.use("*", notFoundMiddleware);
app.use(errorMiddleware);

const { serverDomain, serverPort } = URLS;

app.listen(serverPort, () =>
	console.log(
		`YahalomTests server is running at ${serverDomain}:${serverPort}`
	)
);
