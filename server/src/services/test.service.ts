import { models } from "@yahalom-tests/common";
import { fieldService } from ".";
import { testRepository } from "../DAL";

export const getAllTestsByField = async (fieldId: models.classes.guid) => {
    const field = await fieldService.getStudyFieldById(fieldId);
    const allTests = await testRepository.getAll();
    return allTests.filter(test => field.tests.includes(test.id!));
};
