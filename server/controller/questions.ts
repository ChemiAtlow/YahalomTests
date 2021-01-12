import { models } from "../../common";
import { QuestionsRepository } from "../DAL";

class QuestionsController {
	// Get Questions
	getAllQuestions() {
		return QuestionsRepository.getAllQuestions();
	}

	// Add question to the list
	addQuestion(question: models.Question) {
		if (!question.title) throw "question has no title";
		return QuestionsRepository.addQuestion(question);
	}
}

export const questionsController = new QuestionsController();
