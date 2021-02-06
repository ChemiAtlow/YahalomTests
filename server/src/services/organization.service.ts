import { models } from "@yahalom-tests/common";
import { appLoggerService, fieldService } from ".";
import { HTTPStatuses } from "../constants";
import { organizationRepository } from "../DAL";
import { HttpError, ItemNotInDbError } from "../errors";

export const getAllOrganizations = async () => {
    appLoggerService.verbose("Attempt to get all organizations");
    return await organizationRepository.getAll();
};

export const getOrganizationById = async (id: models.classes.guid) => {
    appLoggerService.verbose("Attempt to get an organization by id", { id });
    const organization = await organizationRepository.getItemById(id);
    if (!organization) {
        appLoggerService.warn("Couldn't find an organization with requested id", { id });
        throw new ItemNotInDbError(id, "Organization");
    }
    appLoggerService.verbose("Found organization with the given id", { organization });
    return organization;
};

export const addQuestion = async (
    organizationId: models.classes.guid,
    questionId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to add a questionId to an organization.", { organizationId, questionId });
    const { questions } = await getOrganizationById(organizationId);
    const questionsUnique = new Set(questions).add(questionId);
    appLoggerService.verbose("Uniqified question id array with new question.", { questionsUnique });
    await organizationRepository.updateItem(organizationId, {
        questions: [...questionsUnique],
    });
};

export const removeQuestion = async (
    organizationId: models.classes.guid,
    questionId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to remove question from organization", { organizationId, questionId });
    const {questions} = await getOrganizationById(organizationId);
    await organizationRepository.updateItem(organizationId, {
        questions: questions.filter(q => q !== questionId),
    });
    appLoggerService.verbose("Question was removed from organization.");
};

export const addStudent = async (organizationId: models.classes.guid, studentEmail: string) => {
    appLoggerService.verbose("Attempt to add a student to an organization.", { organizationId, studentEmail });
    const { students } = await getOrganizationById(organizationId);
    const studentsUnique = new Set(students).add(studentEmail);
    appLoggerService.verbose("Uniqified student id array with new student.", { studentsUnique });
    await organizationRepository.updateItem(organizationId, {
        students: [...studentsUnique],
    });
};

export const isFieldConnectedToOrganization = async (
    organizationId: models.classes.guid,
    fieldId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to check if study field is connected to an organization", { organizationId, fieldId });
    const { fields } = await getOrganizationById(organizationId);
    return fields.includes(fieldId);
};

export const isUserConnectedToOrganization = async (
    organizationId: models.classes.guid,
    userId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to check if user is connected to an organization", { organizationId, userId });
    const { users } = await getOrganizationById(organizationId);
    return users.includes(userId);
};

export const isStudentConnectedToOrganization = async (
    organizationId: models.classes.guid,
    studentEmail: string
) => {
    appLoggerService.verbose("Attempt to check if student is connected to an organization", { organizationId, studentEmail });
    const { students } = await getOrganizationById(organizationId);
    return students.includes(studentEmail);
};

export const isQuestionConnectedToOrganization = async (
    organizationId: models.classes.guid,
    questionId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to check if question is connected to an organization", { organizationId, questionId });
    const organization = await getOrganizationById(organizationId);
    return organization.questions.includes(questionId);
};

export const getOrganizationByTestId = async (testId: models.classes.guid) => {
    appLoggerService.verbose("Get the organization that owns a specific test.", { testId });
    const organizations = await getAllOrganizations();
    for await (const organization of organizations) { //for on organizations
        for await (const fieldId of organization.fields) { //for on fields in organization
            const field = await fieldService.getStudyFieldById(fieldId);
            if (field.tests.includes(testId)) { 
                appLoggerService.verbose("Found the organization that owns the requested test.", { testId, organization });
                return organization;
            }
        }
    }
    //testId doesnt exist
    appLoggerService.verbose("Couldn't Find an organization that owns the requested test.", { testId });
    throw new HttpError(HTTPStatuses.notFound, "No organization contain this test!");
};
