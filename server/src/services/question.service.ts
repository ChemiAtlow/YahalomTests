import { models } from "@yahalom-tests/common";
import { questionRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";
import { appLoggerService, fieldService, organizationService } from "../services";

// Get Questions
export const getAllQuestionsByField = async (fieldId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to get all questions of a study field.", { fieldId });
    const getQuestionsByField = fieldService.getQuestionIdsByField(fieldId);
    const getAllQuestions = questionRepository.getAll();
    const [questionIds, questions] = await Promise.all([
        getQuestionsByField,
        getAllQuestions,
    ]);
    appLoggerService.verbose("Got all question ids of study field, filtering relevant questions.", { fieldId });
    const filteredQuestions = questions.filter(q => questionIds.includes(q.id!));
    return filteredQuestions;
};

export const getQuestionById = async (id: models.classes.guid) => {
    appLoggerService.verbose("Attempt to find question with an id.", { id });
    const question = await questionRepository.getItemById(id);
    if (!question) {
        appLoggerService.warn("Attempt to find question with an id has failed - no question found.", { id });
        throw new ItemNotInDbError(id, "Question");
    }
    appLoggerService.verbose("Attempt to find question with an id completed.", { question });
    return question;
};

// Add question to the list
export const addQuestion = async (
    question: models.dtos.QuestionDto,
    organizationId: models.classes.guid,
    fieldId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to add a question to DB and connect to organization and study field", { question, organizationId, fieldId });
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
    appLoggerService.verbose("Adding question has completed", { newQuestion });
    return newQuestion;
};

export const editQuestion = async (
    id: models.classes.guid,
    updatedQuestion: models.dtos.QuestionDto
) => {
    appLoggerService.verbose("Attempt to edit a question", { id, updatedQuestion });
    return await questionRepository.updateItem(id, {
        ...updatedQuestion,
        lastUpdate: Date.now(),
    });
};

export const isQuestionActive = async (questionId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to check if question is active", { questionId });
    const { testCount } = await getQuestionById(questionId);
    appLoggerService.verbose(`Question found and is used in ${testCount} tests.`, { questionId });
    return testCount > 0;
};

export const deleteQuestion = async (id: models.classes.guid) => {
    appLoggerService.verbose("Attempt to archive question.");
    return await questionRepository.deleteItem(id);
};

export const updateQuestionUsage = async (
    questionIds: models.classes.guid[],
    increment: boolean
) => {
    appLoggerService.verbose("Attempt to update the usage count of questions", { questionIds, increment });
    for await (const qId of questionIds) {
        const { testCount } = await getQuestionById(qId);
        await questionRepository.updateItem(qId, { testCount: testCount + (increment ? 1 : -1) });
    }
};

