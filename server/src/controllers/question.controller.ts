import { models } from "@yahalom-tests/common";
import { Request, Response } from "express";
import { HTTPStatuses } from "../constants";
import { BadRequestError, HttpError, UnauthorizedError } from "../errors";
import { types } from "../models";
import { appLoggerService, fieldService, organizationService, questionService } from "../services";

// Get Questions
export const getAllQuestions = async (req: Request, res: Response) => {
    const { field: fieldId } = req.headers as types.AuthenticatedRequestHeaders;
    appLoggerService.info(`request ${req.id} will fetch all questions of field ${fieldId}`);
    try {
        const data = await questionService.getAllQuestionsByField(fieldId);
        appLoggerService.info(`request ${req.id} fetched all questions of field ${fieldId}`);
        res.send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} fetching all questions of field ${fieldId} has failed with unhandled error.`, { err });
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
    appLoggerService.info(`request ${req.id} will fetch question ${questionId} from organization ${organization}`);
    try {
        if (!await organizationService.isQuestionConnectedToOrganization(organization, questionId)) {
            appLoggerService.info(`request ${req.id} declined - question ${questionId} is not from organiziatoin ${organization}`);
            throw new UnauthorizedError(false);
        }
        const data = await questionService.getQuestionById(questionId);
        appLoggerService.info(`request ${req.id} completed.`, { data });
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} fetching question ${questionId} has failed with unhandled error.`, { err });
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
    const { field, organization } = req.headers as types.AuthenticatedRequestHeaders;
    appLoggerService.info(`request ${req.id} will add question to org ${organization} and field ${field}`, { data: req.body });
    try {
        const data = await questionService.addQuestion(req.body, organization, field);
        appLoggerService.info(`request ${req.id} added question to org ${organization} and field ${field}`, { data });
        res.status(HTTPStatuses.created).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} adding new question to field ${field} has failed with unhandled error.`, { err });
        throw new HttpError(HTTPStatuses.internalServerError, "Unknown issue when adding question");
    }
};

export const editQuestion = async (req: types.RequestWithId, res: Response) => {
    const { organization } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: questionId } = req.params;
    appLoggerService.info(`request ${req.id} will edit question ${questionId} of org ${organization}`, { data: req.body });
    try {
        if (!await organizationService.isQuestionConnectedToOrganization(organization, questionId)) {
            appLoggerService.info(`request ${req.id} declined - question ${questionId} is not from organiziatoin ${organization}`);
            throw new UnauthorizedError(false);
        }
        const data = await questionService.editQuestion(questionId, req.body);
        appLoggerService.info(`request ${req.id} edited question ${questionId} of org ${organization}`, { data });
        res.status(HTTPStatuses.ok).send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} editing question of org ${organization} has failed with unhandled error.`, { err });
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "Unknown issue when editing question"
        );
    }
};

export const deleteQuestion = async (req: types.RequestWithId, res: Response) => {
    const { organization, field } = req.headers as types.AuthenticatedRequestHeaders;
    const { id: questionId } = req.params;
    appLoggerService.info(`request ${req.id} will archive question ${questionId} of org ${organization}`);
    try {
        if (!await organizationService.isQuestionConnectedToOrganization(organization, questionId)) {
            appLoggerService.info(`request ${req.id} declined - question ${questionId} is not from organiziatoin ${organization}.`);
            throw new UnauthorizedError(false);
        }
        if (await questionService.isQuestionActive(questionId)) {
            appLoggerService.info(`request ${req.id} declined - question ${questionId} is currently active.`);
            throw new BadRequestError("Active questions cannot be deleted!");
        }
        const deleteQuestion = questionService.deleteQuestion(questionId);
        const removeFromOrganization = organizationService.removeQuestion(organization, questionId);
        const removeFromStudyField = fieldService.removeQuestion(field, questionId);
        const [deleted] = await Promise.all([deleteQuestion, removeFromOrganization, removeFromStudyField]);
        appLoggerService.info(`request ${req.id} archived question ${questionId} of org ${organization}`, { deleted });
        res.status(HTTPStatuses.ok).send(deleted);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        appLoggerService.warn(`request ${req.id} archiving question ${questionId} of org ${organization} has failed with unhandled error.`, { err });
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "Unknown issue when removing question"
        );
    }
};
