import { models } from "@yahalom-tests/common";
import { studyFieldRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

type FieldBaseInfo = models.interfaces.OrganizationBaseInfo["fields"][0];

export const getStudyFieldsBaseDataByIds = async (ids: models.classes.guid[]) => {
    const fields = await studyFieldRepository.getAll();
    const filteredBaseData = fields.reduce(
        (previous, { name, id }) =>
            ids.includes(id || "") ? [...previous, { name, id }] : previous,
        Array<FieldBaseInfo>()
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
    const { questions } = await getStudyFieldById(fieldId);
    const questionsUnique = new Set(questions).add(questionId);
    await studyFieldRepository.updateItem(fieldId, { questions: [...questionsUnique] });
};

export const removeQuestion = async (
    fieldId: models.classes.guid,
    questionId: models.classes.guid
) => {
    const { questions } = await getStudyFieldById(fieldId);
    studyFieldRepository.updateItem(fieldId, {
        questions: questions.filter(q => q !== questionId),
    });
};

export const addTest = async (fieldId: models.classes.guid, testId: models.classes.guid) => {
    const { tests } = await getStudyFieldById(fieldId);
    const testsUnique = new Set(tests).add(testId);
    await studyFieldRepository.updateItem(fieldId, { tests: [...testsUnique] });
};

export const isTestConnectedToField = async (
    fieldId: models.classes.guid,
    testId: models.classes.guid
) => {
    const field = await getStudyFieldById(fieldId);
    return field.tests.includes(testId);
};
