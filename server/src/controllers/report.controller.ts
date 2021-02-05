import { constants } from "@yahalom-tests/common";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { BadRequestError, HttpError, UnauthorizedError } from "../errors";
import { types } from "../models";
import { examService, organizationService, questionService, studentService, testService } from "../services";

export const getTestReport = async (req: types.RequestWithId<any, any, { start: number; end: number; }>, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: testId } = req.params;
    let { end = 0, start = 0 } = req.query;
    end = isNaN(Number(end)) ? 0 : Number(end +  + constants.TIME.day);
    start = isNaN(Number(start)) ? 0 : Number(start);
    if (end !== 0 && start >= end) {
        throw new BadRequestError("Can't create a report for an invalid date range. start date must be prior to end date.");
    }
    const { id } = await organizationService.getOrganizationByTestId(testId);
    if (id !== organization) {
        throw new UnauthorizedError(false);
    }
    const getExams = examService.getAllExamResultsOfTest(testId, start, end);
    const getTest = testService.getTestsById(testId);
    const [exams, test] = await Promise.all([getExams, getTest]);
    const originalQuestions = await Promise.all(test.questions.map(async q => await questionService.getQuestionById(q)));
    res.send({ exams, test, originalQuestions });
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


