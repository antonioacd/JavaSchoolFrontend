import axios from 'axios';

const TRAINS_API_BASE_URL = "http://localhost:8080/api/trains";

class TrainService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: TRAINS_API_BASE_URL,
        });

        // Agregar un interceptor para incluir el token en las solicitudes
        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('token'); // Obtén el token desde localStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    getTrains(){
        return this.axiosInstance.get(); // Utiliza this.axiosInstance en lugar de axios
    }

    createTrain(scheduleData) {
        return this.axiosInstance.post('', scheduleData); // Utiliza this.axiosInstance en lugar de axios
    }

    deleteTrain(id) {
        return this.axiosInstance.delete(`${TRAINS_API_BASE_URL}/${id}`);
    }

}

const scheduleService = new TrainService();

export default scheduleService;
