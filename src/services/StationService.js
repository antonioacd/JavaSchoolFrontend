import axios from 'axios';

const STATION_API_BASE_URL = "http://localhost:8080/api/stations";

class StationService {
    
    getStations(){
        return axios.get(STATION_API_BASE_URL);
    }

    createStation(stationData) {
        return axios.post(STATION_API_BASE_URL, stationData);
    }
}

const stationService = new StationService();

export default stationService;