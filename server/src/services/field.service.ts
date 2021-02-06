import { models } from "@yahalom-tests/common";
import { appLoggerService } from ".";
import { studyFieldRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

type FieldBaseInfo = models.interfaces.OrganizationBaseInfo["fields"][0];

export const getStudyFieldsBaseDataByIds = async (ids: models.classes.guid[]) => {
    appLoggerService.verbose("Build 'Base Data' for user of requested study fields", { ids });
    const fields = await studyFieldRepository.getAll();
    const filteredBaseData = fields.reduce(
        (previous, { name, id }) =>
        ids.includes(id || "") ? [...previous, { name, id }] : previous,
        Array<FieldBaseInfo>()
    );
    appLoggerService.verbose("Built 'Base Data' of requested study fields", { ids, filteredBaseData });
    return filteredBaseData;
};

export const getStudyFieldById = async (id: models.classes.guid) => {
    appLoggerService.verbose("Attempt to find study field by Id", { id });
    const field = await studyFieldRepository.getItemById(id);
    if (!field) {
        appLoggerService.warn("No study field has given Id", { id });
        throw new ItemNotInDbError(id, "StudyField");
    }
    return field;
};

export const getQuestionIdsByField = async (fieldId: models.classes.guid) => {
    appLoggerService.verbose("Try to get questions of study field");
    const { questions } = await getStudyFieldById(fieldId);
    appLoggerService.verbose("Study field was found successfully");
    return questions;
};

export const addQuestion = async (
    fieldId: models.classes.guid,
    questionId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to add a questionId to a field.", { fieldId, questionId });
    const { questions } = await getStudyFieldById(fieldId);
    const questionsUnique = new Set(questions).add(questionId);
    appLoggerService.verbose("Uniqified question id array with new question.", { questionsUnique });
    await studyFieldRepository.updateItem(fieldId, { questions: [...questionsUnique] });
};

export const removeQuestion = async (
    fieldId: models.classes.guid,
    questionId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to remove question from study field", { fieldId, questionId });
    const { questions } = await getStudyFieldById(fieldId);
    await studyFieldRepository.updateItem(fieldId, {
        questions: questions.filter(q => q !== questionId),
    });
    appLoggerService.verbose("Question was removed from study field");
};

export const addTest = async (fieldId: models.classes.guid, testId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to add a testId to a field.", { fieldId, testId });
    const { tests } = await getStudyFieldById(fieldId);
    const testsUnique = new Set(tests).add(testId);
    appLoggerService.verbose("Uniqified test id array with new test.", { testsUnique });
    await studyFieldRepository.updateItem(fieldId, { tests: [...testsUnique] });
};

export const isTestConnectedToField = async (
    fieldId: models.classes.guid,
    testId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to check if a test is related to study field", { fieldId, testId });
    const field = await getStudyFieldById(fieldId);
    return field.tests.includes(testId);
};
