import axios from 'axios';

const TICKETS_API_BASE_URL = "http://localhost:8080/api/tickets";

class TicketService {

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: TICKETS_API_BASE_URL,
        });

        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    getTickets(){
        return this.axiosInstance.get();
    }

    getTicketsByUser(userId, scheduleId) {
        const params = new URLSearchParams();
        if (userId) {
            params.append('userId', userId);
        }
        if (scheduleId) {
            params.append('scheduleId', scheduleId);
        }
    
        return this.axiosInstance.get(TICKETS_API_BASE_URL + '/searchTicketsByUserAndScheduleId', { params });
    }

    getTicketById(id){
        return this.axiosInstance.get(`${TICKETS_API_BASE_URL}/${id}`);
    }

    updateTicket(id, ticketData) {
        return this.axiosInstance.put(`${TICKETS_API_BASE_URL}/${id}`, ticketData);
    }

    createTicket(ticketData) {
        return this.axiosInstance.post(TICKETS_API_BASE_URL, ticketData);
    }

    deleteTicket(id) {
        console.log("Entra borrado")
        return this.axiosInstance.delete(`${TICKETS_API_BASE_URL}/${id}`);
    }

    getTicketsByScheduleId(scheduleId) {
        const params = new URLSearchParams();
        if (scheduleId) {
            params.append('scheduleId', scheduleId);
        }
    
        return this.axiosInstance.get(TICKETS_API_BASE_URL + '/search/' + scheduleId, { params });
    }

}

const ticketService = new TicketService();

export default ticketService;
