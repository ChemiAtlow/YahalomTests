import { models } from "@yahalom-tests/common";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { testRepository } from "../DAL";
import { HttpError, UnauthorizedError } from "../errors";
import { fieldService, testService } from "../services";
import type { types } from "../models";

// Get Tests
export const getAllTests = async (req: Request, res: Response) => {
    const { field } = req.headers as types.AuthenticatedRequestHeaders;
    try {
        const data = await testService.getAllTestsByField(field);
        res.send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when getting tests");
    }
    return testRepository.getAll();
};

export const getTestById = async (req: types.RequestWithId, res: Response) => {
	const { field } = req.headers as types.AuthenticatedRequestHeaders;
	const { id: questionId } = req.params;
    try {
        if (!await fieldService.isTestConnectedToField(field, questionId)) {
            throw new UnauthorizedError(false);
        }
        const data = await testService.getTestsById(questionId);
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when getting test");
    }
};

// Add test to the list
export const addTest = async (req: Request<never, any, models.dtos.TestDto>, res: Response) => {
    try {
        const { field } = req.headers as types.AuthenticatedRequestHeaders;
        const data = await testService.addTest(req.body, field);
        res.status(HTTPStatuses.created).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when adding test");
    }
};

export const editTest = async (req: types.RequestWithId<any, models.dtos.TestDto>, res: Response) => {
    const { field } = req.headers as types.AuthenticatedRequestHeaders;
	const { id: testId} = req.params;
    try {
        if (!await fieldService.isTestConnectedToField(field, testId)) {
            throw new UnauthorizedError(false);
        }
        const data = await testService.editTest(testId, req.body);
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "Unknown issue when editing test"
        );
    }
};
