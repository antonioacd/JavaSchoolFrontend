import axios from 'axios';

const TRAIN_API_BASE_URL = "http://localhost:8080/api/trains";

class TrainService {
    
    getTrains(){
        return axios.get(TRAIN_API_BASE_URL);
    }

    createTrain(trainData) {
        return axios.post(TRAIN_API_BASE_URL, trainData);
    }
}

const trainService = new TrainService();

export default trainService;