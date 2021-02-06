import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { models, constants } from "@yahalom-tests/common";
import { userRepository } from "../DAL";
import { EmailTakenError, AuthError, HttpError } from "../errors";
import { HTTPStatuses, general } from "../constants";
import { appLoggerService, emailService, fieldService, organizationService } from ".";

export const signup = async ({ email, password }: models.dtos.UserDto) => {
    appLoggerService.verbose("Attempt to sign up new user", { email });
    if (await getUserByEmail(email)) {
        appLoggerService.info("attempt to sign up user failed - email taken", { email });
        throw new EmailTakenError(email);
    }
    const hashedPassword = await hash(password, 12);
    await userRepository.addItem({
        email,
        password: hashedPassword,
        role: "Teacher",
    });
    await emailService.sendSignUpEmail(email);
    appLoggerService.verbose("User sign up completed successfully", { email });
};

export const login = async ({ email, password }: models.dtos.UserDto) => {
    appLoggerService.verbose("Attempt to login a user", { email });
    //check if user exist
    const userFromDb = await getUserByEmail(email);
    if (!userFromDb) {
        appLoggerService.info("attempt to login user failed - no user has this email", { email });
        throw new AuthError();
    }
    //check if encrypted password and password are matching
    const isMatchingPass = await compare(password, userFromDb.password);
    if (!isMatchingPass) {
        appLoggerService.info("attempt to login user failed - the password dosen't match the hash!", { email });
        throw new AuthError();
    }
    appLoggerService.verbose("user password was correct - attempting to build user info", { userFromDb });
    const jwt = createUserJWT(userFromDb);
    //Get info of organization and study fields.
    const organizationsInfo = await buildUserOrganizationAndStudyFieldData(userFromDb.id!);
    appLoggerService.verbose("user info was built, can now complete login.", { userFromDb, organizationsInfo });
    return { jwt, organizationsInfo };
};

export const requestPasswordReset = async ({ email }: models.dtos.RequestPasswordResetDto) => {
    appLoggerService.verbose("Attempt to request a password reset token for user.", { email });
    //check if user exist
    const userFromDb = await getUserByEmail(email);
    if (!userFromDb) {
        appLoggerService.info("attempt to create reset token has failed - no user has this email", { email });
        throw new AuthError();
    }
    //Try generating reset token
    try {
        const token = randomBytes(32).toString("hex");
        appLoggerService.verbose("created token for password reset", { token, email });
        await userRepository.updateItem(userFromDb.id!, {
            resetToken: token,
            resetTokenExpiration: Date.now() + constants.TIME.month,
        });
        await emailService.sendPasswordResetEmail(email, token);
        appLoggerService.verbose("sent token for password reset to user's email", { token, email });
    } catch (err) {
        appLoggerService.warn("Error while generating a reset token", { err });
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(
            HTTPStatuses.internalServerError,
            "An unhandeled error happened when creating reset token."
            );
        }
    };
    
export const resetPassword = async (token: string, { password }: models.dtos.ResetPasswordDto) => {
    appLoggerService.verbose("Attempt to request a password reset with token.", { token });
    //check if user exist
    const userFromDb = await getUserWithResetToken(token);
    if (!userFromDb) {
        appLoggerService.info("attempt to reset password has failed - no user has this token", { token });
        throw new AuthError();
    }
    appLoggerService.verbose("Found user with given reset token.", { userFromDb });
    //If user was found, his token is valid, lets reset him!
    const hashedPassword = await hash(password, 12);
    await userRepository.updateItem(userFromDb.id!, {
        resetToken: undefined,
        resetTokenExpiration: undefined,
        password: hashedPassword,
    });
    appLoggerService.verbose("User with new password saved.", { userFromDb });
};

const buildUserOrganizationAndStudyFieldData = async (userId: models.classes.guid) => {
    appLoggerService.verbose("Build organization and study field info for user", { userId });
    const organizations = await organizationService.getAllOrganizations();
    const userOrganizatios = organizations.filter(org => org.users.includes(userId));
    appLoggerService.verbose("Got all organizations of user, fetching study fields.", { userId });
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
    appLoggerService.verbose("Attempt to find a user by his email", { email });
    const users = await userRepository.getAll();
    const user = users.find(u => u.email === email);
    return user;
};

const getUserWithResetToken = async (token: string) => {
    appLoggerService.verbose("Attempt to find a user by his reset token", { token });
    const users = await userRepository.getAll();
    const user = users.find(u => u.resetToken === token);
    if ((user?.resetTokenExpiration || 0) < Date.now()) {
        return undefined;
    }
    return user;
};

//creats json web token
//server knows how to read it as if it was a user
const createUserJWT = (user: models.interfaces.User) => {
    appLoggerService.verbose("generate a JWT token for user", { user });
    return sign(user, general.jwtSecret, { expiresIn: "30d" });
};
