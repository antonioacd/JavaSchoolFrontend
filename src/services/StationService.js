import axios from 'axios';

const STATIONS_API_BASE_URL = "http://localhost:8080/api/stations";

class StationService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: STATIONS_API_BASE_URL,
        });

        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    getStations(){
        return this.axiosInstance.get();
    }

    getStationById(id){
        return this.axiosInstance.get(`${STATIONS_API_BASE_URL}/${id}`);
    }

    updateStation(id, stationData) {
        return this.axiosInstance.put(`${STATIONS_API_BASE_URL}/${id}`, stationData);
    }

    createStation(stationData) {
        return this.axiosInstance.post('', stationData); // Utiliza this.axiosInstance en lugar de axios
    }

    deleteStation(id) {
        return this.axiosInstance.delete(`${STATIONS_API_BASE_URL}/${id}`);
    }

    getStationsByCity(city) {
        const params = new URLSearchParams();
        if (city) {
            params.append('city', city);
        }

        return this.axiosInstance.get(STATIONS_API_BASE_URL + '/search', { params });
    }

}

const stationService = new StationService();

export default stationService;
