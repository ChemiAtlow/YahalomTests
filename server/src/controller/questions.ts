import { interfaces } from "../models";
import { questionsRepository } from "../DAL";

class QuestionsController {
	// Get Questions
	getAllQuestions() {
		return questionsRepository.getAllQuestions();
	}

	// Add question to the list
	addQuestion(question: interfaces.Question) {
		if (!question.title) {
			throw new Error("question has no title");
		}
		return questionsRepository.addQuestion(question);
	}
}

export const questionsController = new QuestionsController();
