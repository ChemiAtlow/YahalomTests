import type { models } from "@yahalom-tests/common";
import { Repository } from "./reporsitory";

export const questionsRepository = new Repository<models.interfaces.Question>(
	"questionDB.json",
	"Question"
);
