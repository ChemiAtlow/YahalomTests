import { models } from "@yahalom-tests/common";
import { fieldService } from ".";
import { testRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

export const getAllTestsByField = async (fieldId: models.classes.guid) => {
    const field = await fieldService.getStudyFieldById(fieldId);
    const allTests = await testRepository.getAll();
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
    const newTest = await testRepository.addItem({ ...test, teacherEmail, lastUpdate: Date.now() });
    await fieldService.addTest(fieldId, newTest.id!);
    return newTest;
};

export const editTest = async (id: models.classes.guid, updatedTest: models.dtos.TestDto) => {
    await testRepository.updateItem(id, { ...updatedTest, lastUpdate: Date.now() });
};
