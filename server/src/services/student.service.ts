import { models } from "@yahalom-tests/common";
import { appLoggerService, organizationService } from ".";
import { studentRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

// Get Students
export const getAllStudentsOfOrganization = async (organizationId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to find all student of an organization.", { organizationId });
    const getOrganization = organizationService.getOrganizationById(organizationId);
    const getStudents = studentRepository.getAll();
    const [organization, students] = await Promise.all([getOrganization, getStudents]);
    appLoggerService.verbose("Found organization, will now filter relevant students.", { organization });
    return students.filter(st => organization.students.includes(st.email));
};

export const getStudentByEmail = async (email: string) => {
    appLoggerService.verbose("Attempt to find student with email", { email });
    const student = await studentRepository.getItemByEmail(email);
    if (!student) {
        appLoggerService.warn("Did not find student with requested email", { email });
        throw new ItemNotInDbError(email, "Student");
    }
    appLoggerService.verbose("Found student with requested email", { student });
    return student;
};

// Add student to the list, and if he exists update his info.
export const addOrEditStudent = async (
    student: models.dtos.StudentDto,
    organizationId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to edit student, or add mew student if he wasn't found.", { student, organizationId });
    try {
        return await getStudentAndAddToOrganizationIfNeeded(student.email, organizationId);
    } catch (err) {
        return await addNewStudent(student, organizationId);
    }
};

export const markStudentActivity = async (email: string) => {
    appLoggerService.verbose("Attempt to mark student activity", { email });
    await studentRepository.updateItem(email, { lastActivity: Date.now() });
    appLoggerService.verbose("Student activity was marked.", { email });
};

const getStudentAndAddToOrganizationIfNeeded = async (
    email: string,
    organizationId: models.classes.guid
) => {
    appLoggerService.verbose("Attempt to find student, and then add him to organization.", { email, organizationId });
    const existingStudent = await getStudentByEmail(email);
    appLoggerService.verbose("Student found, add him to organzation if needed", { existingStudent });
    const isFromOrg = await organizationService.isStudentConnectedToOrganization(
        organizationId,
        email
    );
    if (!isFromOrg) {
        appLoggerService.verbose("Student was not from organzation adding him now", { existingStudent, organizationId });
        await organizationService.addStudent(organizationId, email);
        appLoggerService.verbose("Student was added to organzation", { existingStudent, organizationId });
    }
    return existingStudent;
};

const addNewStudent = async (
    student: models.dtos.StudentDto,
    organizationId: models.classes.guid
) => {
    appLoggerService.verbose("Add new student to DB and connect to an organization.", { student, organizationId });
    const newStudent = await studentRepository.addItem({ ...student, lastActivity: Date.now() });
    await organizationService.addStudent(organizationId, newStudent.email);
    appLoggerService.verbose("Student was added and connecedt to organization.", { newStudent, organizationId });
    return newStudent;
};
