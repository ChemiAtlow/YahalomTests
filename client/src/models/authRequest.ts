import { models } from "@yahalom-tests/common";

export interface AuthRequest {
    jwt: string;
    organizationId: models.classes.guid;
    studyFieldId: models.classes.guid;
}