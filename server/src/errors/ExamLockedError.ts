import { models } from "@yahalom-tests/common";
import { HTTPStatuses } from "../constants";
import { HttpError } from "./HttpError";

export class ExamLockedError extends HttpError {
    constructor(id: models.classes.guid) {
        super(HTTPStatuses.locked, `Exam is locked: ${id}!`);
    }
}