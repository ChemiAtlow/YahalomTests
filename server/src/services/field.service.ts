import { models } from "@yahalom-tests/common";
import { studyFieldRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

export const getStudyFieldById = async (id: models.classes.guid) =>
    await studyFieldRepository.getItemById(id);

export const getQuestionIdsByField = async (fieldId: models.classes.guid) => {
    const field = await studyFieldRepository.getItemById(fieldId);
    if (!field) { throw new ItemNotInDbError(fieldId, "StudyField"); }
    return field.questions;
};

export const addQuestion = async (fieldId: models.classes.guid, questionId: models.classes.guid) => {
    const field = await getStudyFieldById(fieldId);
    if (!field) { throw new ItemNotInDbError(fieldId, "StudyField"); }
    studyFieldRepository.updateItem(fieldId, { questions: [...field.questions, questionId] });
};
