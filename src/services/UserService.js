import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8080/api/users";

class UserService {
    getUsers(){
        return axios.get(USER_API_BASE_URL);
    }

    createUser(userData) {
        return axios.post(USER_API_BASE_URL, userData);
    }

    login(email, password) {
        return axios.post("http://localhost:8080/api/auth/login", {
            email: email,
            password: password
        });
    }

    register(email, password) {
        return axios.post("http://localhost:8080/api/auth/register", {
            email: email,
            password: password
        });
    }
}

const userService = new UserService();

export default userService;