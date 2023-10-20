import axios from 'axios';

const SCHEDULES_API_BASE_URL = "http://localhost:8080/api/schedules";

class ScheduleService {
    getSchedules(){
        return axios.get(SCHEDULES_API_BASE_URL);
    }

    createSchedule(stationData) {
        return axios.post(SCHEDULES_API_BASE_URL, stationData);
    }
}

const scheduleService = new ScheduleService();

export default scheduleService;