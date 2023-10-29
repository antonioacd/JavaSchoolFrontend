import axios from 'axios';

const SCHEDULES_API_BASE_URL = "http://localhost:8080/api/schedules";

class ScheduleService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: SCHEDULES_API_BASE_URL,
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

    getSchedules(){
        return this.axiosInstance.get(); // Utiliza this.axiosInstance en lugar de axios
    }

    createSchedule(scheduleData) {
        return this.axiosInstance.post('', scheduleData); // Utiliza this.axiosInstance en lugar de axios
    }

    deleteSchedule(id) {
        return this.axiosInstance.delete(`${SCHEDULES_API_BASE_URL}/${id}`);
    }

}

const scheduleService = new ScheduleService();

export default scheduleService;
