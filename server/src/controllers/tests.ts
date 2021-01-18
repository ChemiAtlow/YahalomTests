import { models } from "@yahalom-tests/common";
import { testRepository } from "../DAL";

// Get Tests
export const getAllTests = () => {
	return testRepository.getAll();
};

export const getTestById = (id: models.classes.guid) => {
	return testRepository.getItemById(id);
};

// Add test to the list
export const addTest = (test: models.dtos.TestDto) => {
	return testRepository.addItem({ ...test, lastUpdate: Date.now() });
};

export const editTest = async (
	id: models.classes.guid,
	updatedTest: models.dtos.TestDto
) => {
	await testRepository.updateItem(id, { ...updatedTest, lastUpdate: Date.now() });
	//update old question ==> handled by Repo
	//push  edited question to db ==> handled by Repo
};