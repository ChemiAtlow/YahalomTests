import { models } from "@yahalom-tests/common";
import { fieldService, questionService } from "../services";
import { testRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

export const getAllTestsByField = async (fieldId: models.classes.guid) => {
    const getField = fieldService.getStudyFieldById(fieldId);
    const getTests = testRepository.getAll();
    const [field, allTests] = await Promise.all([getField, getTests]);
    return allTests.filter(test => field.tests.includes(test.id!));
};

export const getTestsById = async (testId: models.classes.guid) => {
    const test = await testRepository.getItemById(testId);
    if (!test) {
        throw new ItemNotInDbError(testId, "Test");
    }
    return test;
};

export const addTest = async (test: models.dtos.TestDto, teacherEmail: string, fieldId: models.classes.guid) => {
    const increment = questionService.updateQuestionUsage(test.questions, true);
    const addTest = testRepository.addItem({ ...test, teacherEmail, lastUpdate: Date.now() });
    const [,newTest] = await Promise.all([increment, addTest]);
    await fieldService.addTest(fieldId, newTest.id!);
    return newTest;
};

export const editTest = async (id: models.classes.guid, updatedTest: models.dtos.TestDto) => {
    const { questions } = await getTestsById(id);
    const removedQuestions = questions.filter(oldQ => updatedTest.questions.every(newQ => oldQ !== newQ));
    const addedQuestions = updatedTest.questions.filter(newQ => questions.every(oldQ => oldQ !== newQ));
    const decrement = questionService.updateQuestionUsage(removedQuestions, false);
    const increment = questionService.updateQuestionUsage(addedQuestions, true);
    const save = testRepository.updateItem(id, { ...updatedTest, lastUpdate: Date.now() });
    const [, , updated] = await Promise.all([decrement, increment, save]);
    return updated;
};
