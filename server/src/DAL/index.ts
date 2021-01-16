import type { models } from "@yahalom-tests/common";
import { Repository } from "./reporsitory";
import { UserRepository } from "./userRepository";

export const organizationRepository = new Repository<models.interfaces.Organization>(
	"organizationDB.json",
	"Organization"
);
export const studyFieldRepository = new Repository<models.interfaces.StudyField>(
	"studyFieldDB.json",
	"StudyField"
);
export const userRepository = new UserRepository("userDB.json");
export const questionsRepository = new Repository<models.interfaces.Question>(
	"questionDB.json",
	"Question"
);
