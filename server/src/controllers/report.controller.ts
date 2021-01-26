import { Response } from "express";
import { HTTPStatuses } from "../constants";
import { types } from "../models";

export const getTestReport = (req: types.RequestWithId, res: Response) => {
    //Technicaly this should be 501 - not implemented, but this will work...
    res.sendStatus(HTTPStatuses.iAmATeapot);
};

export const getStudentReport = (req: types.RequestWithId, res: Response) => {
    //Technicaly this should be 501 - not implemented, but this will work...
    res.sendStatus(HTTPStatuses.iAmATeapot);
};
