import { models } from "@yahalom-tests/common";
import { fieldService } from ".";
import { HTTPStatuses } from "../constants";
import { organizationRepository } from "../DAL";
import { HttpError, ItemNotInDbError } from "../errors";

export const getAllOrganizations = async () => {
    return await organizationRepository.getAll();
};

export const getOrganizationById = async (id: models.classes.guid) => {
    const organization = await organizationRepository.getItemById(id);
    if (!organization) {
        throw new ItemNotInDbError(id, "Organization");
    }
    return organization;
};

export const addQuestion = async (
    organizationId: models.classes.guid,
    questionId: models.classes.guid
) => {
    const { questions } = await getOrganizationById(organizationId);
    const questionsUnique = new Set(questions).add(questionId);
    organizationRepository.updateItem(organizationId, {
        questions: [...questionsUnique],
    });
};

export const removeQuestion = async (
    organizationId: models.classes.guid,
    questionId: models.classes.guid
) => {
    const {questions} = await getOrganizationById(organizationId);
    organizationRepository.updateItem(organizationId, {
        questions: questions.filter(q => q !== questionId),
    });
};

export const addStudent = async (organizationId: models.classes.guid, studentEmail: string) => {
    const { students } = await getOrganizationById(organizationId);
    const studentsUnique = new Set(students).add(studentEmail);
    organizationRepository.updateItem(organizationId, {
        students: [...studentsUnique],
    });
};

export const isFieldConnectedToOrganization = async (
    organizationId: models.classes.guid,
    fieldId: models.classes.guid
) => {
    const organization = await getOrganizationById(organizationId);
    return organization.fields.includes(fieldId);
};

export const isUserConnectedToOrganization = async (
    organizationId: models.classes.guid,
    userdId: models.classes.guid
) => {
    const organization = await getOrganizationById(organizationId);
    return organization.users.includes(userdId);
};

export const isStudentConnectedToOrganization = async (
    organizationId: models.classes.guid,
    studentEmail: string
) => {
    const organization = await getOrganizationById(organizationId);
    return organization.students.includes(studentEmail);
};

export const isQuestionConnectedToOrganization = async (
    organizationId: models.classes.guid,
    questionId: models.classes.guid
) => {
    const organization = await getOrganizationById(organizationId);
    return organization.questions.includes(questionId);
};

export const getOrganizationByTestId = async (testId: models.classes.guid) => {
    const organizations = await getAllOrganizations();
    for await (const org of organizations) { //for on organizations
        for await (const fieldId of org.fields) { //for on fields in organization
            const field = await fieldService.getStudyFieldById(fieldId);
            if (field.tests.includes(testId)) { return org; }
        }
    }
    //testId doesnt exist
    throw new HttpError(HTTPStatuses.notFound, "No organization contain this test!");
};
