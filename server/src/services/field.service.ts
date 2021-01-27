import { models } from "@yahalom-tests/common";
import { studyFieldRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

export const getStudyFieldsBaseDataByIds = async (ids: models.classes.guid[]) => {
    const fields = await studyFieldRepository.getAll();
    const filteredById = fields.filter(fld => ids.includes(fld.id!));
    return filteredById.map(({ name, id }) => ({ name, id }));
};

export const getStudyFieldById = async (id: models.classes.guid) => {
    const field = await studyFieldRepository.getItemById(id);
    if (!field) {
        throw new ItemNotInDbError(id, "StudyField");
    }
    return field;
};

export const getQuestionIdsByField = async (fieldId: models.classes.guid) => {
    const field = await getStudyFieldById(fieldId);
    return field.questions;
};

export const addQuestion = async (
    fieldId: models.classes.guid,
    questionId: models.classes.guid
) => {
    const field = await getStudyFieldById(fieldId);
    await studyFieldRepository.updateItem(fieldId, { questions: [...field.questions, questionId] });
};

export const addTest = async (fieldId: models.classes.guid, testId: models.classes.guid) => {
    const field = await getStudyFieldById(fieldId);
    await studyFieldRepository.updateItem(fieldId, { tests: [...field.tests, testId] });
};

export const isTestConnectedToField = async (
    fieldId: models.classes.guid,
    testId: models.classes.guid
) => {
    const field = await getStudyFieldById(fieldId);
    return field.tests.includes(testId);
};
