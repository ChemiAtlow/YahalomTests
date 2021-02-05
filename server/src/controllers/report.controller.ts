import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { BadRequestError, HttpError, UnauthorizedError } from "../errors";
import { types } from "../models";
import { appLoggerService, examService, organizationService, questionService, studentService, testService } from "../services";

export const getTestReport = async (req: types.RequestWithId<any, any, { start: number; end: number; }>, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: testId } = req.params;
    appLoggerService.info(`request ${req.id} will fetch test report of test ${testId}.`, { organization, testId });
    let { end = 0, start = 0 } = req.query;
    end = isNaN(Number(end)) ? 0 : Number(end);
    start = isNaN(Number(start)) ? 0 : Number(start);
    if (end !== 0 && start >= end) {
        appLoggerService.info(`request ${req.id} declined - invalid range.`, { start, end, organization, testId });
        throw new BadRequestError("Can't create a report for an invalid date range. start date must be prior to end date.");
    }
    try {
        const { id } = await organizationService.getOrganizationByTestId(testId);
        if (id !== organization) {
            appLoggerService.info(`request ${req.id} declined - test is not from your organization!.`, { organization, id });
            throw new UnauthorizedError(false);
        }
        const getExams = examService.getAllExamResultsOfTest(testId, start, end);
        const getTest = testService.getTestsById(testId);
        const [exams, test] = await Promise.all([getExams, getTest]);
        const originalQuestions = await Promise.all(test.questions.map(async q => await questionService.getQuestionById(q)));
        appLoggerService.info(`request ${req.id} fetched test report of test ${test} from organization ${organization}`);
        res.send({ exams, test, originalQuestions });
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} fetching test report of ${testId} has failed with unhandled error.`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Something went wrong while getting students exams");
    }
};

export const getStudentReport = async (req: types.RequestWithEmail, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { email } = req.params;
    appLoggerService.info(`request ${req.id} will fetch student report of student ${email}.`, { organization, email });
    try {
        const exams = await examService.getAllExamResultsOfStudent(email, organization);
        appLoggerService.info(`request ${req.id} fetched student report of student ${email} from organization ${organization}`);
        res.send(exams);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} fetching student report of ${email} has failed with unhandled error.`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Something went wrong while getting students exams");
    }
};

export const getStudents = async (req: Request, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    appLoggerService.info(`request ${req.id} will fetch all student of organization ${organization}.`);
    try {
        const students = await studentService.getAllStudentsOfOrganization(organization);
        appLoggerService.info(`request ${req.id} fetched all students of organization ${organization}`);
        res.send(students);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} fetching students of ${organization} has failed with unhandled error.`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue while getting students");
    }
};


