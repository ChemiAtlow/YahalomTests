import { models } from "@yahalom-tests/common";
import http from "./httpService";

const authRoute = "/auth/";

export async function signup(user: models.interfaces.User) {
    return await http.post<string>(`${authRoute}signup`, user);
}

export async function login(user: models.interfaces.User) {
    return await http.post<string>(`${authRoute}login`, user);
}
