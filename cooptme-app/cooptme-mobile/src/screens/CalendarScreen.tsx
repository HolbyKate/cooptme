import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { EventService, EventDTO } from "../services/events";

const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, []);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const loadEvents = async () => {
    try {
      const fetchedEvents = await EventService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + increment));
    setCurrentMonth(new Date(newMonth));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    let cells = [];

    for (let i = 0; i < startingDay; i++) {
      cells.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      const hasEvents = getEventsForDate(date).length > 0;

      cells.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
          ]}>
            {day}
          </Text>
          {hasEvents && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );

      if ((startingDay + day) % 7 === 0 || day === daysInMonth) {
        days.push(
          <View key={day} style={styles.weekRow}>
            {cells}
          </View>
        );
        cells = [];
      }
    }

    return days;
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Menu color="#4247BD" size={24} />
        </TouchableOpacity>
        <Image
          source={require('../../assets/logo_blue.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <ChevronLeft color="#4247BD" size={24} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <ChevronRight color="#4247BD" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map(day => (
            <Text key={day} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysContainer}>
          {renderCalendar()}
        </View>

        <View style={styles.eventsContainer}>
          <Text style={styles.eventsTitle}>
            Événements du {selectedDate.toLocaleDateString('fr-FR')}
          </Text>
          <ScrollView style={styles.eventsList}>
            {selectedEvents.length > 0 ? (
              selectedEvents.map(event => (
                <View key={event.id} style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time || 'Toute la journée'}</Text>
                  <Text style={styles.eventLocation}>{event.location}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noEventsText}>Aucun événement ce jour</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (styles restent les mêmes que votre code original)
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButton: {
    padding: 8,
  },
  logo: {
    width: 100,
    height: 40,
  },
  calendarContainer: {
    flex: 1,
    padding: 20,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    color: '#4247BD',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    fontFamily: 'Quicksand-Bold',
    width: 40,
    textAlign: 'center',
    color: '#666',
  },
  daysContainer: {
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#4247BD',
  },
  dayText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#333',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF8F66',
    position: 'absolute',
    bottom: 6,
  },
  eventsContainer: {
    flex: 1,
    marginTop: 20,
  },
  eventsTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  eventTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  eventTime: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  eventLocation: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#666',
  },
  noEventsText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});