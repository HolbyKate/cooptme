import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Menu, Calendar, MapPin, Clock } from "lucide-react-native";
import { EventService, EventDTO } from "../services/events";
import { Linking } from "react-native";

export default function EventsScreen() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const fetchedEvents = await EventService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const refreshedEvents = await EventService.refreshEvents();
      setEvents(refreshedEvents);
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const renderEventCard = ({ item }: { item: EventDTO }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => item.url && Linking.openURL(item.url)}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventSource}>{item.source}</Text>
        <Text style={styles.eventType}>
          {item.type === "job_fair"
            ? "🎯 Salon Emploi"
            : item.type === "conference"
              ? "🎤 Conférence"
              : item.type === "meetup"
                ? "👥 Meetup"
                : "📅 Événement"}
        </Text>
      </View>

      <Text style={styles.eventTitle}>{item.title}</Text>

      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {item.time && (
          <View style={styles.detailRow}>
            <Clock size={16} color="#666" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <MapPin size={16} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>

      {item.organizer && (
        <Text style={styles.organizer}>Organisé par: {item.organizer}</Text>
      )}

      <Text style={styles.eventDescription} numberOfLines={3}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4247BD" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.menuButton}>
          <Menu color="#4247BD" size={24} />
        </TouchableOpacity>
        <Image
          source={require("../../assets/logo_blue.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Événements</Text>
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4247BD"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun événement trouvé</Text>
          }
        />
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    color: "#4247BD",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventType: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: "#4247BD",
  },
  eventTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  eventDescription: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventSource: {
    fontFamily: "Quicksand-Regular",
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  organizer: {
    fontFamily: "Quicksand-Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  emptyText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
});
