import { models } from "@yahalom-tests/common";
import { questionRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";
import { fieldService, organizationService, testService } from "../services";

// Get Questions
export const getAllQuestionsByField = async (fieldId: models.classes.guid) => {
    const questionIds = await fieldService.getQuestionIdsByField(fieldId);
    const tests = await testService.getAllTestsByField(fieldId);
    const questions = await questionRepository.getAll();
    const filteredQuestions = questions.filter(q => questionIds.includes(q.id!));
    filteredQuestions.forEach(q => {
        q.testCount = tests.filter(t => t.questions.includes(q.id || "")).length;
        q.active = q.testCount > 0;
    });
    return filteredQuestions;
};

//This method should be in question service
export const getQuestionById = async (id: models.classes.guid) => {
    const question = await questionRepository.getItemById(id);
    if (!question) {
        throw new ItemNotInDbError(id, "Question");
    }
    return question;
};

// Add question to the list
export const addQuestion = async (
    question: models.dtos.QuestionDto,
    organizationId: models.classes.guid,
    fieldId: models.classes.guid
) => {
    const newQuestion = await questionRepository.addItem({
        ...question,
        lastUpdate: Date.now(),
        active: false,
    });
    await organizationService.addQuestion(organizationId, newQuestion.id!);
    await fieldService.addQuestion(fieldId, newQuestion.id!);
    return newQuestion;
};

export const editQuestion = async (
    id: models.classes.guid,
    updatedQuestion: models.dtos.QuestionDto
) =>
    await questionRepository.updateItem(id, {
        ...updatedQuestion,
        active: undefined,
        testCount: undefined,
        lastUpdate: Date.now(),
    });

export const isQuestionActive = async (
    questionId: models.classes.guid,
    fieldId: models.classes.guid
) => {
    const tests = await testService.getAllTestsByField(fieldId);
    const useCount = tests.filter(test => test.questions.includes(questionId));
    return useCount.length > 0;
};

export const deleteQuestion = async (id: models.classes.guid) =>
    await questionRepository.deleteItem(id);
