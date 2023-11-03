import axios from 'axios';

const SCHEDULES_API_BASE_URL = "http://localhost:8080/api/schedules";

class ScheduleService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: SCHEDULES_API_BASE_URL,
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

    getSchedules(){
        return this.axiosInstance.get(); // Utiliza this.axiosInstance en lugar de axios
    }

    getScheduleById(id){
        return this.axiosInstance.get(`${SCHEDULES_API_BASE_URL}/${id}`);
    }

    updateSchedule(id, scheduleData) {
        return this.axiosInstance.put(`${SCHEDULES_API_BASE_URL}/${id}`, scheduleData);
    }

    createSchedule(scheduleData) {
        return this.axiosInstance.post('', scheduleData); // Utiliza this.axiosInstance en lugar de axios
    }

    deleteSchedule(id) {
        return this.axiosInstance.delete(`${SCHEDULES_API_BASE_URL}/${id}`);
    }

    getSchedulesWithFilter(departureCity, arrivalCity) {
        const params = new URLSearchParams();
        if (departureCity) {
            params.append('departureCity', departureCity);
        }
        if (arrivalCity) {
            params.append('arrivalCity', arrivalCity);
        }
    
        return this.axiosInstance.get(SCHEDULES_API_BASE_URL + '/search', { params });
    }
    

}

const scheduleService = new ScheduleService();

export default scheduleService;
