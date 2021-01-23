import { models } from "@yahalom-tests/common";
import { studyFieldRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

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
