import axios from 'axios';

const TICKETS_API_BASE_URL = "http://localhost:8080/api/tickets";

class TicketService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: TICKETS_API_BASE_URL,
        });

        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    getTickets(){
        return this.axiosInstance.get();
    }

    createTicket(scheduleData) {
        return this.axiosInstance.post('', scheduleData);
    }

    deleteTicket(id) {
        return this.axiosInstance.delete(`${TICKETS_API_BASE_URL}/${id}`);
    }

}

const scheduleService = new TicketService();

export default scheduleService;
