import BASE_URL from "./HTTPService"

export const getEmployeeInfo = () => {
    const response = BASE_URL.get("/employees/info");
    return response;
}