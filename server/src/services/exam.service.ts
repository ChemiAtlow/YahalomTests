import { models } from "@yahalom-tests/common"
import { examRepository } from "../DAL"

export const createNewExam = () => {}
export const saveExamChanges = () => {}
export const lockExam = async (examId: models.classes.guid) => {
    return await examRepository.updateItem(examId, { completed: true });
}
export const getAllExamsOfTest = async (testId: models.classes.guid) => {
    const exams = await examRepository.getAll();
    return exams.filter(ex => ex.test === testId);
}