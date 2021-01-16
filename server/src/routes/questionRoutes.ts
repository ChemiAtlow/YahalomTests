import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { routerBuilder } from "./router.builder";
import { questionsController } from "../controllers";
import { HttpError } from "../errors";
import { HTTPStatuses } from "../constants";
import { validationMiddleware } from "../middleware";

export const router = Router();

//Get all questions
router.get("", async (_, res) => {
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
});

//Get question by id
router.get("/:id", async (req, res) => {
	try {
		const data = await questionsController.getQuestionById(req.params.id);
		res.status(HTTPStatuses.ok).send(data);
	} catch (err) {
		if (err instanceof HttpError) {
			throw err;
		}
		throw new HttpError(
			HTTPStatuses.internalServerError,
			"Unknown issue when editing question"
		);
	}
});

//Add question to the list in json
router.post(
	"",
	validationMiddleware(models.dtos.QuestionDto),
	async (req, res) => {
		try {
			const data = await questionsController.addQuestion(req.body);
			res.status(HTTPStatuses.created).send(data);
		} catch (err) {
			if (err instanceof HttpError) {
				throw err;
			}
			throw new HttpError(
				HTTPStatuses.internalServerError,
				"Unknown issue when adding question"
			);
		}
	}
);

//Edit question
router.put(
	"/:id",
	validationMiddleware(models.dtos.QuestionDto, true),
	async (req, res) => {
		try {
			const data = await questionsController.editQuestion(
				req.params.id,
				req.body
			);
			res.status(HTTPStatuses.ok).send(data);
		} catch (err) {
			if (err instanceof HttpError) {
				throw err;
			}
			throw new HttpError(
				HTTPStatuses.internalServerError,
				"Unknown issue when editing question"
			);
		}
	}
);

router.delete("/:id", async (req, res) => {
	try {
		const data = await questionsController.deleteQuestion(req.params.id);
		res.status(HTTPStatuses.ok).send(data);
	} catch (err) {
		if (err instanceof HttpError) {
			throw err;
		}
		throw new HttpError(
			HTTPStatuses.internalServerError,
			"Unknown issue when removing question"
		);
	}
});
