import { models } from "@yahalom-tests/common";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { BadRequestError, HttpError, UnauthorizedError } from "../errors";
import { organizationService, questionService } from "../services";

// Get Questions
export const getAllQuestions = async (req: Request, res: Response) => {
    try {
        const fieldId = req.headers.field as models.classes.guid;
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
export const getQuestionById = async (req: Request, res: Response) => {
    const organizationId = req.headers.organization as models.classes.guid;
    const questionId = req.params.id as models.classes.guid;
    try {
        if (!organizationService.isQuestionConnectedToOrganization(organizationId, questionId)) {
            throw new UnauthorizedError(false);
        }
        const data = await questionService.getQuestionById(req.params.id);
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

// Add question to the list
export const addQuestion = async (req: Request, res: Response) => {
    try {
        const { field, organization } = req.headers as {
            field: models.classes.guid;
            organization: models.classes.guid;
        };
        const data = await questionService.addQuestion(req.body, organization, field);
        res.status(HTTPStatuses.created).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when adding question");
    }
};

export const editQuestion = async (req: Request, res: Response) => {
    const organizationId = req.headers.organization as models.classes.guid;
    const questionId = req.params.id as models.classes.guid;
    try {
        if (!organizationService.isQuestionConnectedToOrganization(organizationId, questionId)) {
            throw new UnauthorizedError(false);
        }
        const data = await questionService.editQuestion(req.params.id, req.body);
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

export const deleteQuestion = async (req: Request, res: Response) => {
    const organizationId = req.headers.organization as models.classes.guid;
    const fieldId = req.headers.field as models.classes.guid;
    const questionId = req.params.id as models.classes.guid;
    try {
        if (!organizationService.isQuestionConnectedToOrganization(organizationId, questionId)) {
            throw new UnauthorizedError(false);
        }
        if (questionService.isQuestionActive(req.params.id, fieldId)) {
            throw new BadRequestError("Active questions cannot be deleted!");
        }
        const data = await questionService.deleteQuestion(req.params.id);
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
