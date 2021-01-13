import type { models } from "@yahalom-tests/common";
import { questionsRepository } from "../DAL";
import { BadRequestError } from "../errors";

class QuestionsController {
	// Get Questions
	getAllQuestions() {
		return questionsRepository.getAllQuestions();
	}

	// Add question to the list
	addQuestion(question: models.Question) {
		if (!question.title) {
			throw new BadRequestError("Question has no title");
		}
		return questionsRepository.addQuestion(question);
	}
}

export const questionsController = new QuestionsController();
