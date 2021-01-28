import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { HttpError } from "../errors";
import { types } from "../models";
import { examService, organizationService, studentService } from "../services";

export const getTestReport = (req: types.RequestWithId, res: Response) => {
    //Technicaly this should be 501 - not implemented, but this will work...
    res.sendStatus(HTTPStatuses.iAmATeapot);
};

export const getStudentReport = async (req: types.RequestWithEmail, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { email } = req.params;
    try {
        const exams = await examService.getAllExamsOfStudent(email, organization);
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


