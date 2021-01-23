import { models } from "@yahalom-tests/common";
import { organizationRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

export const getOrganizationById = async (id: models.classes.guid) =>
    await organizationRepository.getItemById(id);

export const addQuestion = async (organizationId: models.classes.guid, questionId: models.classes.guid) => {
    const organization = await getOrganizationById(organizationId);
    if (!organization) { throw new ItemNotInDbError(organizationId, "Organization"); }
    organizationRepository.updateItem(organizationId, { questions: [...organization.questions, questionId] });
};

export const isFieldConnectedToOrganization = async (organizationId: models.classes.guid, fieldId: models.classes.guid) => {
    const organization = await getOrganizationById(organizationId);
    if (!organization) { throw new ItemNotInDbError(organizationId, "Organization"); }
    return organization.fields.includes(fieldId);
};

export const isUserConnectedToOrganization = async (organizationId: models.classes.guid, userdId: models.classes.guid) => {
    const organization = await getOrganizationById(organizationId);
    if (!organization) { throw new ItemNotInDbError(organizationId, "Organization"); }
    return organization.users.includes(userdId);
};
