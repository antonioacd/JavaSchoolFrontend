import axios from 'axios';

const STATIONS_API_BASE_URL = "http://localhost:8080/api/stations";

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

    getScheduleById(id){
        return this.axiosInstance.get(`${STATIONS_API_BASE_URL}/${id}`);
    }

    updateSchedule(id, stationData) {
        return this.axiosInstance.put(`${STATIONS_API_BASE_URL}/${id}`, stationData);
    }

    createStation(stationData) {
        return this.axiosInstance.post('', stationData); // Utiliza this.axiosInstance en lugar de axios
    }

    deleteStation(id) {
        return this.axiosInstance.delete(`${STATIONS_API_BASE_URL}/${id}`);
    }

}

const stationService = new StationService();

export default stationService;
