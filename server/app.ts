import express from "express";
import cors from "cors";
import compression from "compression";
import { json } from "body-parser";

import questionRouter from "./routes/questionRoutes";
import Urls from "./settings/staticUrls";

const app = express();

app.use(cors());
app.use(json());
app.use(compression());

app.use("/api/Questions", questionRouter);
app.use("*", notFoundMiddleware);
app.use(errorMiddleware);

app.listen(Urls.serverPort, () =>
	console.log(
		`YahalomTests server is running at ${Urls.serverDomain}:${Urls.serverPort}`
	)
);
