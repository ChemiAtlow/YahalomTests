import { models } from "@yahalom-tests/common";

declare global {
    namespace Express {
        interface Request { user: models.interfaces.User }
    }
}
