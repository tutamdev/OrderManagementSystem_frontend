import BASE_URL from "./HTTPService"

export const register = (account) => {
    const response = BASE_URL.post("auth/register", account);
    return response;
}

export const login = (account) => {
    const response = BASE_URL.post("auth/login", account);
    return response;
}

export const logout = (token) => {
    const response = BASE_URL.post("auth/logout", token);
    return response;
}

export const refreshToken = (token) => {
    const respose = BASE_URL.post("auth/refresh", token);
    return respose;
}