import axios from 'axios';

const TRAINS_API_BASE_URL = "http://localhost:8080/api/trains";

class TrainService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: TRAINS_API_BASE_URL,
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

    getTrains(){
        return this.axiosInstance.get();
    }

    getTrainById(id){
        return this.axiosInstance.get(`${TRAINS_API_BASE_URL}/${id}`);
    }

    updateTrain(id, trainData) {
        return this.axiosInstance.put(`${TRAINS_API_BASE_URL}/${id}`, trainData);
    }

    createTrain(trainData) {
        return this.axiosInstance.post('', trainData); // Utiliza this.axiosInstance en lugar de axios
    }

    deleteTrain(id) {
        return this.axiosInstance.delete(`${TRAINS_API_BASE_URL}/${id}`);
    }

}

const trainService = new TrainService();

export default trainService;
