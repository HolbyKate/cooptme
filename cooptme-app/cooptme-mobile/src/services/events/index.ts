export interface EventDTO {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  organizer?: string;
  type: 'job_fair' | 'conference' | 'meetup' | 'other';
  source: string;
  url?: string;
}

const mockEvents: EventDTO[] = [
  {
    id: '1',
    title: 'Meetup React Native',
    description: 'Discussion sur les dernières fonctionnalités de React Native',
    date: '2024-12-18',
    time: '14:00 - 16:00',
    location: 'Station F, Paris',
    organizer: 'React France',
    type: 'meetup',
    source: 'Meetup.com',
    url: 'https://example.com/meetup-react'
  },
  {
    id: '2',
    title: 'Forum de l\'emploi Tech',
    description: 'Rencontrez les entreprises qui recrutent',
    date: '2024-12-20',
    time: '09:00 - 18:00',
    location: 'Paris Expo',
    organizer: 'TechRecruit',
    type: 'job_fair',
    source: 'JobTech',
    url: 'https://example.com/forum-tech'
  },
  {
    id: '3',
    title: 'Workshop Design System',
    description: 'Apprenez à créer un design system efficace',
    date: '2024-12-20',
    time: '10:00 - 12:00',
    location: 'La Défense',
    organizer: 'UX Design France',
    type: 'conference',
    source: 'Eventbrite',
    url: 'https://example.com/workshop-design'
  }
];

export const EventService = {
  getAllEvents: async (): Promise<EventDTO[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockEvents;
  },

  // Ajout de la méthode refreshEvents
  refreshEvents: async (): Promise<EventDTO[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Dans un vrai service, on ferait un nouvel appel à l'API
    // Pour l'instant, on retourne les mêmes données mockées
    return mockEvents;
  },

  getEventById: async (id: string): Promise<EventDTO | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents.find(event => event.id === id) || null;
  },

  getEventsByDate: async (date: Date): Promise<EventDTO[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  },

  getEventsByMonth: async (year: number, month: number): Promise<EventDTO[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  }
};
