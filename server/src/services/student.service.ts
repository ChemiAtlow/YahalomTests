import { models } from "@yahalom-tests/common";
import { organizationService } from ".";
import { studentRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

// Get Students
export const getAllStudentsOfOrganization = async (organizationId: models.classes.guid) => {
    const organization = await organizationService.getOrganizationById(organizationId);
    const students = await studentRepository.getAll();
    return students.filter(st => organization.students.includes(st.email));
};

export const getStudentByEmail = async (email: string) => {
    const student = await studentRepository.getItemByEmail(email);
    if (!student) {
        throw new ItemNotInDbError(email, "Student");
    }
    return student;
};

// Add student to the list, and if he exists update his info.
export const addOrEditStudent = async (
    student: models.dtos.StudentDto,
    organizationId: models.classes.guid
) => {
    try {
        return await getUserAndAddToOrganizationIfNeeded(student.email, organizationId);
    } catch (err) {
        return await addNewStudent({ ...student }, organizationId);
    }
};

const getUserAndAddToOrganizationIfNeeded = async (
    email: string,
    organizationId: models.classes.guid
) => {
    const existingStudent = await getStudentByEmail(email);
    const isFromOrg = await organizationService.isStudentConnectedToOrganization(
        organizationId,
        email
    );
    if (!isFromOrg) {
        await organizationService.addStudent(organizationId, email);
    }
    return existingStudent;
};

const addNewStudent = async (
    student: models.dtos.StudentDto,
    organizationId: models.classes.guid
) => {
    const newStudent = await studentRepository.addItem({ ...student, lastActivity: Date.now() });
    await organizationService.addStudent(organizationId, newStudent.email);
    return newStudent;
};
