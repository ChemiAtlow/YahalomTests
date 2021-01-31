import { models } from "@yahalom-tests/common";
import { Response } from "express";
import { HTTPStatuses } from "../constants";
import { BadRequestError, ExamLockedError, HttpError } from "../errors";
import { types } from "../models";
import { certificationService, emailService, examService, organizationService, studentService, testService } from "../services";

export const getExam = async (req: types.RequestWithId, res: Response) => {
    const { id: examId } = req.params;
    let toSend: models.interfaces.Exam | models.interfaces.ExamResult;
    try {
        if (await examService.isExamLocked(examId)) {
            const { result } = await examService.getExamResult(examId);
            toSend = result;
        } else {
            toSend = await examService.getExamById(examId);
        }
        res.send(toSend);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unhandled error while getting your exam");
    }
};

export const getExamPassedCertificate = async (req: types.RequestWithId, res: Response) => {
    const { id: examId } = req.params;
    //check if exam is locked
    if (!await examService.isExamLocked(examId)) {
        throw new BadRequestError("The exam wasn't completed yet!");
    }
    try {
        const { title, teacherEmail, studentEmail, result } = await examService.getExamResult(examId);
        if (result.grade < result.minPassGrade) {
            throw new BadRequestError("You need to pass to test to get the certificate");
        }
        const student = await studentService.getStudentByEmail(studentEmail);
        const doc = certificationService.createCertificate(student, title, teacherEmail);
        doc.pipe(res);
        doc.end();
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unhandled error while creating your certificate");
    }
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
    await examService.saveExamChanges(examId, req.body);
    res.status(HTTPStatuses.ok).send({ message: "Successfully saved" });
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
