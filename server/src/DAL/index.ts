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
export const questionRepository = new Repository<models.interfaces.Question>(
	"questionDB.json",
	"Question"
);
export const testRepository = new Repository<models.interfaces.Test>(
	"testDB.json",
	"Test"
);
