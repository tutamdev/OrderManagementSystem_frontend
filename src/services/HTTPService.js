import axios from "axios";
import LocalStorageService from "./LocalStorageService";
import { refreshToken } from "./AuthService";
import { jwtDecode } from "jwt-decode";

// Cấu hình axios HTTP
const BASE_URL = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: {
        "Content-Type": "application/json"
    }
});

// Biến cờ để kiểm soát việc hiển thị alert
let isTokenInvalid = false;

// Thực hiện trước khi gửi request
BASE_URL.interceptors.request.use(
    async (config) => {
        // Các URL không cần token
        const authURL = ["auth/login", "auth/register", "auth/logout", "auth/introspect", "auth/refresh"];
        // Kiểm tra URL trong request gửi đi có authURL hay không
        const requestURL = config.url;
        const hasAuthURL = authURL.some(url => requestURL.includes(url));
        // Nếu có thì trả về một config không kèm token
        if (hasAuthURL) return config;

        /**
         * Kiểm tra token có trong LocalStorage chưa! 
         * Nếu không có thì chuyển hướng về trang login
         */
        const token = LocalStorageService.getItem("token");

        if (!token) {
            if (!isTokenInvalid) {
                isTokenInvalid = true; // Đánh dấu token không hợp lệ
                LocalStorageService.clear();
                alert("Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại!"); // Sử dụng alert
                window.location.href = "/login";
            }
            return Promise.reject(new Error("Token không tồn tại"));
        }

        /**
         * Nếu token có exp nhỏ hơn hiện tại, ta tiến hành refresh token
         * Nếu trả về là token thì set giá trị token mới, nếu trả về là 401 thì remove token cũ và logout
         */
        const decodedToken = jwtDecode(token);
        const currentTime = new Date().getTime();
        if (decodedToken.exp < Math.floor(currentTime / 1000)) {
            try {
                const response = await refreshToken(token);
                const newToken = response?.data?.result.token;
                LocalStorageService.setItem("token", newToken);
                config.headers.Authorization = `Bearer ${newToken}`;
            } catch (error) {
                if (!isTokenInvalid) {
                    isTokenInvalid = true; // Đánh dấu token không hợp lệ
                    // Xóa hết dữ liệu trong LocalStorage
                    LocalStorageService.clear();
                    alert("Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại!"); // Sử dụng alert
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default BASE_URL;