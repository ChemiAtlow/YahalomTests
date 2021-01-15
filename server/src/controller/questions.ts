import { models } from "@yahalom-tests/common";
import { questionsRepository } from "../DAL";
import { BadRequestError } from "../errors";

// Get Questions
export const getAllQuestions = () => {
	return questionsRepository.getAll();
};

export const getQuestionById = (id: models.classes.guid) => {
	return questionsRepository.getItemById(id);
};

// Add question to the list
export const addQuestion = (question: models.dtos.QuestionDto) => {
	return questionsRepository.addItem(question);
};

export const editQuestion = async (
	id: models.classes.guid,
	updatedQuestion: models.dtos.QuestionDto
) => {
	await questionsRepository.updateItem(id, updatedQuestion);
	//update old question ==> handled by Repo
	//push  edited question to db ==> handled by Repo
};

export const deleteQuestion = async (id: models.classes.guid) => {
	await questionsRepository.deleteItem(id);
};
