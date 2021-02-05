import { models } from "@yahalom-tests/common";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { testRepository } from "../DAL";
import { HttpError, UnauthorizedError } from "../errors";
import { appLoggerService, fieldService, testService } from "../services";
import type { types } from "../models";

// Get Tests
export const getAllTests = async (req: Request, res: Response) => {
    const { field } = req.headers as types.AuthenticatedRequestHeaders;
    appLoggerService.info(`request ${req.id} will fetch all tests of field ${field}`);
    try {
        const data = await testService.getAllTestsByField(field);
        appLoggerService.info(`request ${req.id} fetched all tests of field ${field}`);
        res.send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} fetching all tests of field ${field} has failed with unhandled error.`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when getting tests");
    }
    return testRepository.getAll();
};

export const getTestById = async (req: types.RequestWithId, res: Response) => {
    const { field } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: questionId } = req.params;
    appLoggerService.info(`request ${req.id} will fetch test ${questionId} from field ${field}`);
    try {
        if (!await fieldService.isTestConnectedToField(field, questionId)) {
            appLoggerService.info(`request ${req.id} declined - test ${questionId} is not from field ${field}`);
            throw new UnauthorizedError(false);
        }
        const data = await testService.getTestsById(questionId);
        appLoggerService.info(`request ${req.id} completed.`, { data });
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} fetching test ${questionId} has failed with unhandled error.`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when getting test");
    }
};

// Add test to the list
export const addTest = async (req: Request<never, any, models.dtos.TestDto>, res: Response) => {
    const { field } = req.headers as types.AuthenticatedRequestHeaders;
    appLoggerService.info(`request ${req.id} will add test to field ${field}`, { data: req.body });
    try {
        const data = await testService.addTest(req.body, req.user!.email, field);
        appLoggerService.info(`request ${req.id} added test to field ${field}`, { data });
        res.status(HTTPStatuses.created).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} adding new test to field ${field} has failed with unhandled error.`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when adding test");
    }
};

export const editTest = async (req: types.RequestWithId<any, models.dtos.TestDto>, res: Response) => {
    const { field } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: testId } = req.params;
    appLoggerService.info(`request ${req.id} will edit test ${testId} of field ${field}`, { data: req.body });
    try {
        if (!await fieldService.isTestConnectedToField(field, testId)) {
            appLoggerService.info(`request ${req.id} declined - test ${testId} is not from field ${field}`);
            throw new UnauthorizedError(false);
        }
        const data = await testService.editTest(testId, req.body);
        appLoggerService.info(`request ${req.id} edited test ${testId} of field ${field}`, { data });
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} editing test of field ${field} has failed with unhandled error.`, { err });
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "Unknown issue when editing test"
        );
    }
};
