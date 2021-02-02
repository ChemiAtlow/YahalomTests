import { models } from "@yahalom-tests/common";
import { questionRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";
import { fieldService, organizationService } from "../services";

// Get Questions
export const getAllQuestionsByField = async (fieldId: models.classes.guid) => {
    const getQuestionsByField = fieldService.getQuestionIdsByField(fieldId);
    const getAllQuestions = questionRepository.getAll();
    const [questionIds, questions] = await Promise.all([
        getQuestionsByField,
        getAllQuestions,
    ]);
    const filteredQuestions = questions.filter(q => questionIds.includes(q.id!));
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
        testCount: 0,
    });
    const addQuestionToOrganization = organizationService.addQuestion(
        organizationId,
        newQuestion.id!
    );
    const addQuestionToStudyField = fieldService.addQuestion(fieldId, newQuestion.id!);
    await Promise.all([addQuestionToOrganization, addQuestionToStudyField]);
    return newQuestion;
};

export const editQuestion = async (
    id: models.classes.guid,
    updatedQuestion: models.dtos.QuestionDto
) =>
    await questionRepository.updateItem(id, {
        ...updatedQuestion,
        lastUpdate: Date.now(),
    });

export const isQuestionActive = async (questionId: models.classes.guid) => {
    const { testCount } = await getQuestionById(questionId);
    return testCount > 0;
};

export const deleteQuestion = async (id: models.classes.guid) =>
    await questionRepository.deleteItem(id);

export const updateQuestionUsage = async (
    questionIds: models.classes.guid[],
    increment: boolean
) => {
    // const allQuestions = await questionRepository.getAll();
    for await (const qId of questionIds) {
        const { testCount } = await getQuestionById(qId);
        await questionRepository.updateItem(qId, { testCount: testCount + (increment ? 1 : -1) });
    }
};

