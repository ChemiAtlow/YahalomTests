import { models } from "../../../common";
import { questionsRepository } from "../DAL";
import { BadRequestError } from "../errors";

// Get Questions
export const getAllQuestions = () => {
	return questionsRepository.getAllQuestions();
};

// Add question to the list
export const addQuestion = (question: models.interfaces.Question) => {
	questionValidation(question);
	return questionsRepository.addQuestion(question);
};

// validation for question
const questionValidation = (question: models.interfaces.Question) => {
	if (!question.title?.trim()) {
		throw new BadRequestError("Question has no title");
	}
	if (!Array.isArray(question.answers) || !question.answers.length) {
		throw new BadRequestError("Qeustion does not contain answers");
	}

	if (!question.label?.trim()) {
		throw new BadRequestError("Question must have at least one label");
	}

	let correctAnswersCount = 0;
	//check if answer has content and its not whitespace
	question.answers.forEach((a, i) => {
		if (!a.content?.trim()) {
			throw new BadRequestError(`Answer in index ${i} has no content`);
		}
		if (a.correct) { correctAnswersCount++; }
	});

	if (!correctAnswersCount) {
		throw new BadRequestError("Question must have at least one correct answer");
	}

	question.alignment = question.alignment || "Vertical";

	question.type = correctAnswersCount === 1 ?
		models.enums.QuestionType.SingleChoice :
		models.enums.QuestionType.MultiChoice;
};