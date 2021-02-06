import { models } from "@yahalom-tests/common";
import { appLoggerService, fieldService, questionService } from "../services";
import { testRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

export const getAllTestsByField = async (fieldId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to get all tests of requested field", { fieldId });
    const getField = fieldService.getStudyFieldById(fieldId);
    const getTests = testRepository.getAll();
    const [{ tests }, allTests] = await Promise.all([getField, getTests]);
    appLoggerService.verbose("Got all tests of requested field", { fieldId });
    return allTests.filter(test => tests.includes(test.id!));
};

export const getTestsById = async (testId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to find test with specific id", { testId });
    const test = await testRepository.getItemById(testId);
    if (!test) {
        appLoggerService.verbose("Attempt to find test with specific id has failed - no test has this id", { testId });
        throw new ItemNotInDbError(testId, "Test");
    }
    return test;
};

export const addTest = async (test: models.dtos.TestDto, teacherEmail: string, fieldId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to create a new test", { test, teacherEmail, fieldId });
    const increment = questionService.updateQuestionUsage(test.questions, true);
    const addTest = testRepository.addItem({ ...test, teacherEmail, lastUpdate: Date.now() });
    const [,newTest] = await Promise.all([increment, addTest]);
    appLoggerService.verbose("Test was saved, and question usage was updated", { newTest });
    await fieldService.addTest(fieldId, newTest.id!);
    appLoggerService.verbose("Test was added to study field");
    return newTest;
};

export const editTest = async (id: models.classes.guid, updatedTest: models.dtos.TestDto) => {
    appLoggerService.verbose("Attempt to edit existing test", { id, updatedTest });
    const { questions } = await getTestsById(id);
    const removedQuestions = questions.filter(oldQ => updatedTest.questions.every(newQ => oldQ !== newQ));
    const addedQuestions = updatedTest.questions.filter(newQ => questions.every(oldQ => oldQ !== newQ));
    appLoggerService.verbose("Calculate removed and added questions, in order to fix usage count.", { removedQuestions, addedQuestions });
    const decrement = questionService.updateQuestionUsage(removedQuestions, false);
    const increment = questionService.updateQuestionUsage(addedQuestions, true);
    const save = testRepository.updateItem(id, { ...updatedTest, lastUpdate: Date.now() });
    const [, , updated] = await Promise.all([decrement, increment, save]);
    appLoggerService.verbose("Made needed changes to DB for editing test.", { id, updated });
    return updated;
};
