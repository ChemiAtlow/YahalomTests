import { routeBuilder } from "./route.builder";
import controller from "../controller/questions";

export const router = routeBuilder([
	// Get questions from json
	{
		method: "get",
		controller: async (req, res) => {
			const data = await controller.getAllQuestions();

			res.send(data);
		},
	},
	// Add question to the list in json
	{
		method: "post",
		controller: async (req, res) => {
			try {
				const data = await controller.addQuestion(req.body);
				res.status(200).send(data);
			} catch (err) {
				res.status(400).send(err);
			}
		},
	},
]);
