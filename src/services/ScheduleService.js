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
        return this.axiosInstance.get();
    }

    getScheduleById(id){
        return this.axiosInstance.get(`${SCHEDULES_API_BASE_URL}/${id}`);
    }

    updateSchedule(id, scheduleData) {
        return this.axiosInstance.put(`${SCHEDULES_API_BASE_URL}/${id}`, scheduleData);
    }

    createSchedule(scheduleData) {
        return this.axiosInstance.post('', scheduleData);
    }

    deleteSchedule(id) {
        return this.axiosInstance.delete(`${SCHEDULES_API_BASE_URL}/${id}`);
    }

    getSchedulesByCitiesAndDate(departureCity, arrivalCity, selectedDate) {
        const params = new URLSearchParams();
        if (departureCity) {
            params.append('departureCity', departureCity);
        }
        if (arrivalCity) {
            params.append('arrivalCity', arrivalCity);
        }
        if (selectedDate) {
            params.append('selectedDate', selectedDate);
        }
    
        return this.axiosInstance.get(SCHEDULES_API_BASE_URL + '/search', { params });
    }
    
    getschedulesByTrainNumber(trainNumber) {
        const params = new URLSearchParams();
        if (trainNumber) {
            params.append('trainNumber', trainNumber);
        }

        return this.axiosInstance.get(SCHEDULES_API_BASE_URL + '/searchByTrainNumber', { params });
    }

}

const scheduleService = new ScheduleService();

export default scheduleService;
