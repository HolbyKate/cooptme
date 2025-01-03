import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { EventService, EventDTO } from "../services/events";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface EventDTO {
  id: string;
  title: string;
  description?: string;
  type?: string;
  date: string;
  time?: string;
  location?: string;
  contact?: string;
}

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<EventDTO>>({
    title: "",
    description: "",
    type: "general",
    date: new Date().toISOString(),
    time: "",
    location: "",
    contact: "" as string | undefined,
  });

  const contacts = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
  ];

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
      console.error("Error loading events:", error);
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
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.title.trim()) {
      alert("The title is required.");
      return;
    }

    const newEventToAdd: EventDTO = {
      id: Date.now().toString(),
      title: newEvent.title.trim(),
      description: newEvent.description || "No description",
      type: newEvent.type || "general",
      date: newEvent.date || new Date().toISOString(),
      time: newEvent.time || "All day",
      location: newEvent.location || "No location",
      contact: newEvent.contact || "Unknown contact",
    };

    setEvents([...events, newEventToAdd]);
    setNewEvent({
      title: "",
      description: "",
      type: "general",
      date: new Date().toISOString(),
      time: "",
      location: "",
      contact: "",
    });
    setModalVisible(false);
  };

  const changeMonth = (increment: number) => {
    const newMonth = new Date(
      currentMonth.setMonth(currentMonth.getMonth() + increment)
    );
    setCurrentMonth(new Date(newMonth));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    let cells = [];

    for (let i = 0; i < startingDay; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const hasEvents = getEventsForDate(date).length > 0;

      cells.push(
        <TouchableOpacity
          key={day}
          style={[styles.dayCell, isSelected && styles.selectedDay]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
            {day}
          </Text>
          {hasEvents && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );

      if ((startingDay + day) % 7 === 0 || day === daysInMonth) {
        days.push(
          <View key={`week-${day}`} style={styles.weekRow}>
            {cells}
          </View>
        );
        cells = [];
      }
    }

    while (cells.length > 0 && cells.length < 7) {
      cells.push(<View key={`empty-${cells.length}`} style={styles.dayCell} />);
    }
    if (cells.length > 0) {
      days.push(
        <View key="last-row" style={styles.weekRow}>
          {cells}
        </View>
      );
    }

    return days;
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Menu color="#4247BD" size={24} />
        </TouchableOpacity>
        <Image
          source={require("../../assets/logo_blue.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Calendar */}
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
          {WEEKDAYS.map((day) => (
            <Text key={day} style={styles.weekdayText}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysContainer}>{renderCalendar()}</View>
      </View>

      {/* Events */}
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>
          Events on {selectedDate.toLocaleDateString()}
        </Text>
        <ScrollView style={styles.eventsList}>
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>
                  {event.time || "All day"}
                </Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>No events today</Text>
          )}
        </ScrollView>
      </View>

      {/* Add Event Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Event</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#888"
              value={newEvent.title}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, title: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 14:00)"
              placeholderTextColor="#888"
              value={newEvent.time}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, time: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#888"
              value={newEvent.location}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, location: text })
              }
            />
            <Picker
              selectedValue={newEvent.contact}
              onValueChange={(itemValue) =>
                setNewEvent({ ...newEvent, contact: itemValue })
              }
              style={styles.picker}
            >
              {contacts.map((contact) => (
                <Picker.Item
                  label={contact.name}
                  value={contact.id}
                  key={contact.id}
                />
              ))}
            </Picker>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={addEvent}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: "#4247BD",
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekdayText: {
    fontFamily: "Quicksand-Bold",
    width: 40,
    textAlign: "center",
    color: "#666",
  },
  daysContainer: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: "#4247BD",
  },
  dayText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 16,
    color: "#333",
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF8F66",
    position: "absolute",
    bottom: 6,
  },
  eventsContainer: {
    flex: 1,
    marginTop: 20,
  },
  eventsTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  eventTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  eventTime: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  eventLocation: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#666",
  },
  noEventsText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  filterButtonActive: {
    backgroundColor: "#4247BD",
    borderRadius: 20,
    padding: 10,
  },
  filterText: {
    color: "#FFFFFF",
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#4247BD",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: "#4247BD",
    marginBottom: 15,
    textAlign: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#4247BD",
  },
  buttonSecondary: {
    backgroundColor: "#DDD",
  },
  buttonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  buttonTextSecondary: {
    color: "#4247BD",
  },
});
