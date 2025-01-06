import React, { useEffect, useState } from "react";
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { profileService } from '../services/profileService';
import { LinkedInProfile } from '../types';

type ProfileDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileDetail'>;

export default function ProfileDetailScreen() {
  const navigation = useNavigation<ProfileDetailScreenNavigationProp>();
  const route = useRoute();
  const { profileId } = route.params as { profileId: string };
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const loadedProfile = await profileService.getProfileById(profileId);
        setProfile(loadedProfile);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };
    loadProfile();
  }, [profileId]);

  if (!profile) {
    return <LoadingScreen />;
  }

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
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>
              {profile.firstName[0]}
              {profile.lastName[0]}
            </Text>
          </View>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.function}>{profile.title}</Text>
          <Text style={styles.company}>{profile.company}</Text>
          <Text style={styles.location}>{profile.location}</Text>
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
