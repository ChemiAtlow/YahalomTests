import { models } from "../../../common";
import { questionsRepository } from "../DAL";
import { BadRequestError } from "../errors";

// Get Questions
export const getAllQuestions = () => {
	return questionsRepository.getAllQuestions();
}

// Add question to the list
export const addQuestion = (question: models.interfaces.Question) => {
	questionValidation(question);
	return questionsRepository.addQuestion(question);
}

// validation for question
const questionValidation = (question: models.interfaces.Question) => {
	if (!question.title) {
		throw new BadRequestError("Question has no title");
	}
	if (!Array.isArray(question.answers) || !question.answers.length) {
		throw new BadRequestError("Invalid answers");
	}

	const correctAnswersCount = question.answers.filter(a => a.correct).length;
	if (!correctAnswersCount) {
		throw new BadRequestError("Question must have at least one correct answer");
	}

	if (!question.label.length) {
		throw new BadRequestError("Question must have at least one label");
	}

	question.alignment = question.alignment || "Vertical";

	question.type = correctAnswersCount === 1 ?
		models.enums.QuestionType.SingleChoice :
		models.enums.QuestionType.MultiChoice;
}