import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { HttpError, UnauthorizedError } from "../errors";
import { types } from "../models";
import { examService, organizationService, questionService, studentService, testService } from "../services";

export const getTestReport = async (req: types.RequestWithId, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: testId } = req.params;
    const { id } = await organizationService.getOrganizationByTestId(testId);
    if (id !== organization) {
        throw new UnauthorizedError(false);
    }
    const getExams = examService.getAllExamResultsOfTest(testId);
    const getTest = testService.getTestsById(testId);
    const [exams, test] = await Promise.all([getExams, getTest]);
    const origonalQuestions = await Promise.all(test.questions.map(async q => await questionService.getQuestionById(q)));
    res.send({ exams, test, origonalQuestions });
};

export const getStudentReport = async (req: types.RequestWithEmail, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { email } = req.params;
    try {
        const exams = await examService.getAllExamResultsOfStudent(email, organization);
        res.send(exams);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Something went wrong while getting students exams");
    }
};

export const getStudents = async (req: Request, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    try {
        const students = await studentService.getAllStudentsOfOrganization(organization);
        res.send(students);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue while getting students");
    }
};


