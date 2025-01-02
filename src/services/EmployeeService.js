import BASE_URL from "./HTTPService"

export const getEmployeeInfo = () => {
    const response = BASE_URL.get("/employees/info");
    return response;
}

export const getAllEmployee = () => {
    const response = BASE_URL.get("/employees")
    return response;
}

export const updateEmployee = (employee) => {
    const response = BASE_URL.put(`/employees/${employee.id}`, employee);
    return response;
}

export const getMyInfor = () => {
    const response = BASE_URL.get("/employees/info");
    return response;
}

export const updateInformation = (user) => {
    const response = BASE_URL.put("/employees/info", user);
    return response;
}
