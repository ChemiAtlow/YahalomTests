import { models } from "@yahalom-tests/common";
import { studyFieldRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

export const getStudyFieldsBaseDataByIds = async (ids: models.classes.guid[]) => {
    const fields = await studyFieldRepository.getAll();
    const filteredBaseData = fields.reduce(
        (previous, { name, id }) =>
            ids.includes(id || "") ? [...previous, { name, id }] : previous,
        Array<models.interfaces.OrganizationBaseInfo["fields"][0]>()
    );
    return filteredBaseData;
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
    studyFieldRepository.updateItem(fieldId, { questions: [...field.questions, questionId] });
};

export const addTest = async (fieldId: models.classes.guid, testId: models.classes.guid) => {
    const field = await getStudyFieldById(fieldId);
    studyFieldRepository.updateItem(fieldId, { tests: [...field.tests, testId] });
};

export const isTestConnectedToField = async (
    fieldId: models.classes.guid,
    testId: models.classes.guid
) => {
    const field = await getStudyFieldById(fieldId);
    return field.tests.includes(testId);
};
