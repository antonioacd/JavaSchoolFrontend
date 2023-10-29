import axios from 'axios';

const STAION_API_BASE_URL = "http://localhost:8080/api/stations";

class StationService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: STAION_API_BASE_URL,
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

    getStations(){
        return this.axiosInstance.get(); // Utiliza this.axiosInstance en lugar de axios
    }

    createStation(scheduleData) {
        return this.axiosInstance.post('', scheduleData); // Utiliza this.axiosInstance en lugar de axios
    }

    deleteStation(id) {
        return this.axiosInstance.delete(`${STAION_API_BASE_URL}/${id}`);
    }

}

const scheduleService = new StationService();

export default scheduleService;
