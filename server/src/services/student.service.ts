import { models } from "@yahalom-tests/common";
import { organizationService } from ".";
import { studentRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

// Get Students
export const getAllStudentsOfOrganization = async (organizationId: models.classes.guid) => {
    const organization = await organizationService.getOrganizationById(organizationId);
    const students = await studentRepository.getAll();
    return students.filter(st => organization.students.includes(st.email));;
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
    { email, ...rest }: models.dtos.StudentDto,
    organizationId: models.classes.guid
) => {
    try {
        const existingStudent = await getStudentByEmail(email);
        const isFromOrg = await organizationService.isStudentConnectedToOrganization(
            organizationId,
            email
        );
        if (!isFromOrg) {
            await organizationService.addStudent(organizationId, email);
        }
        return existingStudent;
    } catch (err) {
        const newStudent = await studentRepository.addItem({
            ...rest,
            email,
            lastActivity: Date.now(),
        });
        await organizationService.addStudent(organizationId, newStudent.email);
        return newStudent;
    }
};
