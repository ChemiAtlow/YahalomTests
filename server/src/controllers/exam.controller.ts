import { models } from "@yahalom-tests/common";
import { Response } from "express";
import { HTTPStatuses } from "../constants";
import { BadRequestError, ExamLockedError, HttpError } from "../errors";
import { types } from "../models";
import { appLoggerService, certificationService, emailService, examService, organizationService, studentService, testService } from "../services";

export const getExam = async (req: types.RequestWithId, res: Response) => {
    const { id: examId } = req.params;
    appLoggerService.info(`request ${req.id} requested exam ${examId}`);
    let toSend: models.interfaces.Exam | models.interfaces.ExamResult;
    try {
        if (await examService.isExamLocked(examId)) {
            const { result } = await examService.getExamResult(examId);
            appLoggerService.verbose(`request ${req.id} got an exam result`, { result });
            toSend = result;
        } else {
            toSend = await examService.getExamById(examId);
            appLoggerService.verbose(`request ${req.id} got a none-locked exam`, { result: toSend });
        }
        res.send(toSend);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`Request ${req.id} failed getting exam with unhadled error`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Unhandled error while getting your exam");
    }
};

export const getExamPassedCertificate = async (req: types.RequestWithId, res: Response) => {
    const { id: examId } = req.params;
    appLoggerService.info(`request ${req.id} requested exam certificate ${examId}`);
    //check if exam is locked
    if (!await examService.isExamLocked(examId)) {
        appLoggerService.info(`request ${req.id} certificate declined - exam is not submmited yet.`);
        throw new BadRequestError("The exam wasn't completed yet!");
    }
    try {
        const { title, teacherEmail, studentEmail, result } = await examService.getExamResult(examId);
        if (result.grade < result.minPassGrade) {
            appLoggerService.info(`request ${req.id} certificate declined due to low grade.`);
            throw new BadRequestError("You need to pass to test to get the certificate");
        }
        const student = await studentService.getStudentByEmail(studentEmail);
        appLoggerService.verbose(`request ${req.id} creating certificate.`);
        const doc = certificationService.createCertificate(student, title, teacherEmail);
        doc.pipe(res);
        doc.end();
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`Request ${req.id} failed creating certificate with unhadled error`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Unhandled error while creating your certificate");
    }
};

export const createExam = async (req: types.RequestWithId<any, models.dtos.StudentDto>, res: Response) => {
    const { id: testId } = req.params;
    appLoggerService.info(`request ${req.id} requested to create exam for test ${testId}`, { student: req.body });
    try {
        const { id: organizationId } = await organizationService.getOrganizationByTestId(testId);
        const student = await studentService.addOrEditStudent(req.body, organizationId);
        const markStudentActivity = studentService.markStudentActivity(student.email);
        const createExam = examService.createNewExam(testId, student.email);
        const [, exam] = await Promise.all([markStudentActivity, createExam]);
        res.status(HTTPStatuses.created).send(exam);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`Request ${req.id} failed creating exam with unhadled error`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Unhandled error while creating your exam");
    }
};

export const updateExam = async (req: types.RequestWithId<any, models.dtos.ExamChangeDto>, res: Response) => {
    const { id: examId } = req.params;
    appLoggerService.info(`request ${req.id} requested updating exam ${examId}`, { changes: req.body });
    const isLocked = await examService.isExamLocked(examId); //check if exam was already done.
    if (isLocked) {
        appLoggerService.info(`request ${req.id} updating exam ${examId} declined - exam is locked.`);
        throw new ExamLockedError(examId);
    }
    await examService.saveExamChanges(examId, req.body);
    appLoggerService.info(`request ${req.id} updating exam ${examId} completed.`);
    res.status(HTTPStatuses.ok).send({ message: "Successfully saved" });
};

export const submitExam = async (req: types.RequestWithId, res: Response) => {
    const { id: examId } = req.params;
    appLoggerService.info(`request ${req.id} requested submitting exam ${examId}`);
    const isLocked = await examService.isExamLocked(examId); //check if exam was already done.
    if (isLocked) {
        appLoggerService.info(`request ${req.id} submitting exam ${examId} declined - exam is already locked.`);
        throw new ExamLockedError(examId);
    }
    await examService.lockExam(examId);
    const { email, result, teacherEmail, completionDate = 0, title, studentEmail } = await examService.getExamResult(examId);
    const markStudentActivity = studentService.markStudentActivity(studentEmail);
    const getStudentByEmail = studentService.getStudentByEmail(studentEmail);
    const [student] = await Promise.all([getStudentByEmail, markStudentActivity]);
    emailService.sendTestStatusEmail(email, title, student, completionDate, result.grade, examId, teacherEmail);
    appLoggerService.info(`request ${req.id} submitting exam ${examId} completed.`);
    res.status(HTTPStatuses.ok).send(result);
};

export const checkIfTestExist = async (req: types.RequestWithId, res: Response) => {
    const { id: examId } = req.params;
    appLoggerService.info(`request ${req.id} checkinng if ${examId} exists.`);
    await testService.getTestsById(examId);
    res.send({ message: "test was found" });
};
