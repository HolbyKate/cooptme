import { apiClient } from '../middleware/api.middleware';
import { Event, EventDTO } from '../types/index';

class EventService {
    async getAllEvents(): Promise<EventDTO[]> {
        try {
            const response = await apiClient.get('/events');
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération des événements');
        }
    }

    async getEventById(id: string): Promise<EventDTO> {
        try {
            const response = await apiClient.get(`/events/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération de l\'événement');
        }
    }

    async createEvent(eventData: Partial<Event>): Promise<EventDTO> {
        try {
            const response = await apiClient.post('/events', eventData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de création de l\'événement');
        }
    }

    async updateEvent(id: string, eventData: Partial<Event>): Promise<EventDTO> {
        try {
            const response = await apiClient.put(`/events/${id}`, eventData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de mise à jour de l\'événement');
        }
    }

    async deleteEvent(id: string): Promise<void> {
        try {
            await apiClient.delete(`/events/${id}`);
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de suppression de l\'événement');
        }
    }

    async getEventsByDate(date: Date): Promise<EventDTO[]> {
        try {
            const response = await apiClient.get('/events/date', { params: { date: date.toISOString() } });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération des événements par date');
        }
    }

    async getEventsByMonth(year: number, month: number): Promise<EventDTO[]> {
        try {
            const response = await apiClient.get('/events/month', { params: { year, month } });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération des événements par mois');
        }
    }
}

export const eventService = new EventService();