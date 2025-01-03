import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { Contact } from "./ProfileGenerator";
import profileService from '../services/profileService';
import { LinkedInProfile } from '../types';

export default function ProfileDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact } = route.params as { contact: Contact };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft color="#4247BD" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          {contact.photo ? (
            <Image
              source={{
                uri: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 100)}.jpg`,
              }}
              style={styles.profilePhoto}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {contact.firstName[0]}
                {contact.lastName[0]}
              </Text>
            </View>
          )}
          <Text style={styles.name}>
            {contact.firstName} {contact.lastName}
          </Text>
          <Text style={styles.function}>{contact.function}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{contact.category}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Lieu de rencontre</Text>
            <Text style={styles.infoValue}>{contact.meetingPlace}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Catégorie</Text>
            <Text style={styles.infoValue}>{contact.category}</Text>
          </View>

          {/* Ajoutez d'autres informations selon vos besoins */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  photoPlaceholderText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 36,
    color: "#4247BD",
  },
  name: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    color: "#333",
    marginBottom: 8,
  },
  function: {
    fontFamily: "Quicksand-Regular",
    fontSize: 18,
    color: "#666",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#4247BD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: "#FFFFFF",
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: "#333",
  },
});
