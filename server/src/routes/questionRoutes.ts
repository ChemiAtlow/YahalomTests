import { routerBuilder } from "./router.builder";
import { questionsController } from "../controller";
import { HttpError } from "../errors";
import { HTTPStatuses } from "../constants";

export const router = routerBuilder([
	// Get questions from json
	{
		method: "get",
		controller: async (_req, res) => {
			try {
				const data = await questionsController.getAllQuestions();
				res.send(data);
			} catch (err) {
				if (err instanceof HttpError) {
					throw err;
				}
				throw new HttpError(
					HTTPStatuses.internalServerError,
					"Unknown issue when getting question"
				);
			}
		},
	},
	// Add question to the list in json
	{
		method: "post",
		controller: async (req, res) => {
			try {
				const data = await questionsController.addQuestion(req.body);
				res.status(201).send(data);
			} catch (err) {
				if (err instanceof HttpError) {
					throw err;
				}
				throw new HttpError(
					HTTPStatuses.internalServerError,
					"Unknown issue when adding question"
				);
			}
		},
	},
	//Get question by id
	{
		method: "get",
		path: "/:id",
		controller: async (req, res) => {
			try {
				const data = await questionsController.getQuestionById(
					req.params.id
				);
				res.status(200).send(data);
			} catch (err) {
				if (err instanceof HttpError) {
					throw err;
				}
				throw new HttpError(
					HTTPStatuses.internalServerError,
					"Unknown issue when editing question"
				);
			}
		},
	},
	//Edit question
	{
		method: "put",
		path: "/:id",
		controller: async (req, res) => {
			try {
				const data = await questionsController.editQuestion(
					req.params.id,
					req.body
				);
				res.status(200).send(data);
			} catch (err) {
				if (err instanceof HttpError) {
					throw err;
				}
				throw new HttpError(
					HTTPStatuses.internalServerError,
					"Unknown issue when editing question"
				);
			}
		},
	},
	//Delete question
	{
		method: "delete",
		path: "/:id",
		controller: async (req, res) => {
			try {
				const data = await questionsController.deleteQuestion(
					req.params.id
				);
				res.status(200).send(data);
			} catch (err) {
				if (err instanceof HttpError) {
					throw err;
				}
				throw new HttpError(
					HTTPStatuses.internalServerError,
					"Unknown issue when removing question"
				);
			}
		},
	},
]);
