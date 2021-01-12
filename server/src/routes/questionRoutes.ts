import { routeBuilder } from "./route.builder";
import { questionsController } from "../controller";

export const router = routeBuilder([
	// Get questions from json
	{
		method: "get",
		controller: async (req, res) => {
			const data = await questionsController.getAllQuestions();

			res.send(data);
		},
	},
	// Add question to the list in json
	{
		method: "post",
		controller: async (req, res) => {
			try {
				const data = await questionsController.addQuestion(req.body);
				res.status(200).send(data);
			} catch (err) {
				res.status(400).send(err);
			}
		},
	},
]);
