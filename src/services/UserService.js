import axios from 'axios';

const USERS_API_BASE_URL = "http://localhost:8080/api/users";

class UserService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: USERS_API_BASE_URL,
        });

        // Agregar un interceptor para incluir el token en las solicitudes
        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken'); // Obtén el token desde localStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    getUsers(){
        return axios.get(USERS_API_BASE_URL);
    }

    getUserById(id){
        return this.axiosInstance.get(`${USERS_API_BASE_URL}/${id}`);
    }

    getUserByEmail(email){
        return this.axiosInstance.get(`${USERS_API_BASE_URL}/${email}`);
    }

    createUser(userData) {
        return axios.post(USERS_API_BASE_URL, userData);
    }

    login(email, password) {
        return axios.post("http://localhost:8080/api/auth/login", {
            email: email,
            password: password
        });
    }

    register(name, surname, email, password) {
        return axios.post("http://localhost:8080/api/auth/register", {
            name: name,
            surname: surname,
            email: email,
            password: password
        });
    }
}

const userService = new UserService();

export default userService;