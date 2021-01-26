import { models } from "@yahalom-tests/common";
import http from "./httpService";

const authRoute = "/auth/";

export async function signup(user: models.dtos.UserDto) {
    await http.post<void>(`${authRoute}signup`, user);
}

export async function login(user: models.dtos.UserDto) {
    return await http.post<{
        jwt: string;
        organizationsInfo: models.interfaces.OrganizationBaseInfo[];
    }>(`${authRoute}login`, user);
}

export async function sendResetPasswordEmail(value: models.dtos.RequestPasswordResetDto) {
    await http.post<void>(`${authRoute}reset`, value);
}

export async function resetPassword(token: string, value: models.dtos.ResetPasswordDto) {
    return await http.post<void>(`${authRoute}reset/${token}`, value);
}
