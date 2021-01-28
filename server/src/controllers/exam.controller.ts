import { models } from "@yahalom-tests/common";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { ExamLockedError, HttpError } from "../errors";
import { types } from "../models";
import { certificationService, emailService, examService, organizationService, studentService, testService } from "../services";

export const getExamPassedCertificate = (req: Request, res: Response) => {
    //TODO: Validate exam was actually passed successfully, and gather info for certificate.
    const doc = certificationService.createCertificate({
        firstName: "Reem",
        lastName: "Cohen",
    });
    doc.pipe(res);
    doc.end();
};

export const createExam = async (req: types.RequestWithId<any, models.dtos.StudentDto>, res: Response) => {
    const { id: testId } = req.params;
    try {
        const { id: organizationId } = await organizationService.getOrganizationByTestId(testId);
        const student = await studentService.addOrEditStudent(req.body, organizationId);
        const exam = await examService.createNewExam(testId, student.email);
        res.status(HTTPStatuses.created).send(exam);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unhandled error while creating your exam");
    }
};

export const updateExam = async (req: types.RequestWithId<any, models.dtos.ExamChangeDto>, res: Response) => {
    const { id: examId } = req.params;
    const isLocked = await examService.isExamLocked(examId); //check if exam was already done.
    if (isLocked) { throw new ExamLockedError(examId); }
    const data = await examService.saveExamChanges(examId, req.body);
    res.status(HTTPStatuses.ok).send(data);
};

export const submitExam = async (req: types.RequestWithId, res: Response) => {
    const { id: examId } = req.params;
    await examService.lockExam(examId);
    const { email, result, teacherEmail, completionDate = 0, title, studentEmail } = await examService.getExamResult(examId);
    const student = await studentService.getStudentByEmail(studentEmail);
    emailService.sendTestStatusEmail(email, title, student, completionDate, result.grade, examId, teacherEmail);
    res.status(HTTPStatuses.ok).send(result);
};

export const checkIfTestExist = async (req: types.RequestWithId, res: Response) => {
    await testService.getTestsById(req.params.id);
    res.send({ message: "test was found" });
};
