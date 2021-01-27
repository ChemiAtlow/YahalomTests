import type { models } from "@yahalom-tests/common";
import { Repository } from "./reporsitory";
import { StudentRepository } from "./studentRepository";

export const organizationRepository = new Repository<models.interfaces.Organization>(
    "organizationDB.json",
    "Organization"
);
export const studyFieldRepository = new Repository<models.interfaces.StudyField>(
    "studyFieldDB.json",
    "StudyField"
);
export const userRepository = new Repository<models.interfaces.User>("userDB.json", "User");

export const questionRepository = new Repository<models.interfaces.Question>(
    "questionDB.json",
    "Question"
);
export const testRepository = new Repository<models.interfaces.Test>("testDB.json", "Test");
export const examRepository = new Repository<models.interfaces.Exam>("examDB.json", "Exam");
export const studentRepository = new StudentRepository("studentDB.json");
