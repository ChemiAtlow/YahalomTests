import { models } from "@yahalom-tests/common";
import { organizationRepository } from "../DAL";
import { ItemNotInDbError } from "../errors";

export const getOrganizationById = async (id: models.classes.guid) => {
    const organization = await organizationRepository.getItemById(id);
    if (!organization) {
        throw new ItemNotInDbError(id, "Organization");
    }
    return organization;
};

export const addQuestion = async (
    organizationId: models.classes.guid,
    questionId: models.classes.guid
) => {
    const organization = await getOrganizationById(organizationId);
    organizationRepository.updateItem(organizationId, {
        questions: [...organization.questions, questionId],
    });
};

export const isFieldConnectedToOrganization = async (
    organizationId: models.classes.guid,
    fieldId: models.classes.guid
) => {
    const organization = await getOrganizationById(organizationId);
    return organization.fields.includes(fieldId);
};

export const isUserConnectedToOrganization = async (
    organizationId: models.classes.guid,
    userdId: models.classes.guid
) => {
    const organization = await getOrganizationById(organizationId);
    return organization.users.includes(userdId);
};
