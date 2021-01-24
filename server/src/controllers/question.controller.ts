import { models } from "@yahalom-tests/common";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { BadRequestError, HttpError, UnauthorizedError } from "../errors";
import { types } from "../models";
import { organizationService, questionService } from "../services";

// Get Questions
export const getAllQuestions = async (req: Request, res: Response) => {
    const { field: fieldId } = req.headers as types.AuthenticatedRequestHeaders;
    try {
        const data = await questionService.getAllQuestionsByField(fieldId);
        res.send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "Unknown issue when getting question"
        );
    }
};

//This method should be in question service
export const getQuestionById = async (req: types.RequestWithId, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: questionId } = req.params;
    try {
        if (!organizationService.isQuestionConnectedToOrganization(organization, questionId)) {
            throw new UnauthorizedError(false);
        }
        const data = await questionService.getQuestionById(questionId);
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "Unknown issue when getting question"
        );
    }
};

// Add question to the list
export const addQuestion = async (
    req: Request<never, any, models.dtos.QuestionDto>,
    res: Response
) => {
    try {
        const { field, organization } = req.headers as types.AuthenticatedRequestHeaders;
        const data = await questionService.addQuestion(req.body, organization, field);
        res.status(HTTPStatuses.created).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when adding question");
    }
};

export const editQuestion = async (req: types.RequestWithId, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: questionId } = req.params;
    try {
        if (!organizationService.isQuestionConnectedToOrganization(organization, questionId)) {
            throw new UnauthorizedError(false);
        }
        const data = await questionService.editQuestion(questionId, req.body);
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "Unknown issue when editing question"
        );
    }
};

export const deleteQuestion = async (req: types.RequestWithId, res: Response) => {
    const { organization, field } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: questionId } = req.params;
    try {
        if (!organizationService.isQuestionConnectedToOrganization(organization, questionId)) {
            throw new UnauthorizedError(false);
        }
        if (questionService.isQuestionActive(questionId, field)) {
            throw new BadRequestError("Active questions cannot be deleted!");
        }
        const data = await questionService.deleteQuestion(questionId);
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "Unknown issue when removing question"
        );
    }
};
