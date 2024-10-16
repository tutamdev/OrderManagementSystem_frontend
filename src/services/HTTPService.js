import axios from "axios";

// Cấu hình axios HTTP
const BASE_URL = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: {
        "Content-Type": "application/json"
    }
});

// Thực hiện trước khi gửi request
BASE_URL.interceptors.request.use(
    (config) => {
        // các URL không yêu cầu token
        const notTokenRequired = ["/auth/login", "/auth/register", "/auth/logout", "/introspect"];
        if (notTokenRequired.some((url) => config.url.includes(url))) {
            // Không kèm theo token
            console.log("token")
            return config;
        }
        // Các trang còn lại yêu cầu token thì
        // Lấy token từ LocalStorage
        const token = localStorage.getItem("token");
        /**
         * Gửi đến server request kèm theo token
         * Nếu có token mà bị lỗi. Refresh Token, nếu có thì cập nhật token, nếu lỗi (token hết hạn)
         * thì xóa token trong LocalStorage và chuyển hướng đến màn hình login
         */
        if(token) {
            try {
                config.headers.Authorization = `Bearer ${token}`;
            } catch(error) {
                // ERROR: navigate login
                // LOG: Phiên đăng nhập kết thúc, vui lòng đăng nhập lại!
                console.log("HTTPService: ", error);
            }
        } else {
            // navigate login
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default BASE_URL;