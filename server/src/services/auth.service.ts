import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { models, constants } from "@yahalom-tests/common";
import { userRepository } from "../DAL";
import { EmailTakenError, AuthError, HttpError } from "../errors";
import { HTTPStatuses, general } from "../constants";
import { emailService, fieldService, organizationService } from ".";

export const signup = async ({ email, password }: models.dtos.UserDto) => {
    if (await getUserByEmail(email)) {
        throw new EmailTakenError(email);
    }
    const hashedPassword = await hash(password, 12);
    await userRepository.addItem({
        email,
        password: hashedPassword,
        role: "Teacher",
    });
    await emailService.sendSignUpEmail(email);
};

export const login = async ({ email, password }: models.dtos.UserDto) => {
    //check if user exist
    const userFromDb = await getUserByEmail(email);
    if (!userFromDb) {
        throw new AuthError();
    }
    //check if encrypted password and password are matching
    const isMatchingPass = await compare(password, userFromDb.password);
    if (!isMatchingPass) {
        throw new AuthError();
    }
    const jwt = createUserJWT(userFromDb);
    //Get info of organization and study fields.
    const organizationsInfo = await buildUserOrganizationAndStudyFieldData(userFromDb.id!);
    return { jwt, organizationsInfo };
};

export const requestPasswordReset = async ({ email }: models.dtos.RequestPasswordResetDto) => {
    //check if user exist
    const userFromDb = await getUserByEmail(email);
    if (!userFromDb) {
        throw new AuthError();
    }
    //Try generating reset token
    try {
        const token = randomBytes(32).toString("hex");
        await userRepository.updateItem(userFromDb.id!, {
            resetToken: token,
            resetTokenExpiration: Date.now() + constants.TIME.month,
        });
        await emailService.sendPasswordResetEmail(email, token);
    } catch (err) {
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "An unhandeled error happened when creating reset token."
        );
    }
};

export const resetPassword = async (token: string, { password }: models.dtos.ResetPasswordDto) => {
    //check if user exist
    const userFromDb = await getUserWithResetToken(token);
    if (!userFromDb) {
        throw new AuthError();
    }
    //If user was found, his token is valid, lets reset him!
    const hashedPassword = await hash(password, 12);
    await userRepository.updateItem(userFromDb.id!, {
        resetToken: undefined,
        resetTokenExpiration: undefined,
        password: hashedPassword,
    });
};

const buildUserOrganizationAndStudyFieldData = async (userId: models.classes.guid) => {
    const organizations = await organizationService.getAllOrganizations();
    const userOrganizatios = organizations.filter(org => org.users.includes(userId));
    return await Promise.all(
        userOrganizatios.map<Promise<models.interfaces.OrganizationBaseInfo>>(
            async ({ fields: fieldIds, name, id }) => {
                const fields = await fieldService.getStudyFieldsBaseDataByIds(fieldIds);
                return {
                    id: id as models.classes.guid,
                    name,
                    fields,
                };
            }
        )
    );
};

const getUserByEmail = async (email: string) => {
    const users = await userRepository.getAll();
    const user = users.find(u => u.email === email);
    return user;
};

const getUserWithResetToken = async (token: string) => {
    const users = await userRepository.getAll();
		const user = users.find(u => u.resetToken === token);
		if ((user?.resetTokenExpiration || 0) < Date.now()) {
			return undefined;
		}
		return user;
};

//creats json web token
//server knows how to read it as if it was a user
const createUserJWT = (user: models.interfaces.User) =>
    sign(user, general.jwtSecret, { expiresIn: "30d" });
