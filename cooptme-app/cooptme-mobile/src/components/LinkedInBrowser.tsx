import React, { useRef, useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import WebView from "react-native-webview";
import { X } from "lucide-react-native";
import {
  LinkedInProfile,
  LINKEDIN_LOGIN_SCRIPT,
  LINKEDIN_SCRAPING_SCRIPT,
  saveLinkedInAuth,
  saveProfile,
} from "../utils/linkedinScraper";

interface LinkedInBrowserProps {
  isVisible: boolean;
  profileUrl: string;
  onClose: () => void;
  onProfileScraped: (profile: LinkedInProfile) => void;
}

export default function LinkedInBrowser({
  isVisible,
  profileUrl,
  onClose,
  onProfileScraped,
}: LinkedInBrowserProps) {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleMessage = async (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case "LOGIN_PAGE":
          // On est sur la page de login, on attend que l'utilisateur se connecte
          break;

        case "AUTH_STATUS":
          if (data.isLoggedIn) {
            await saveLinkedInAuth({ isLoggedIn: true });
            // Injecter le script de scraping une fois connecté
            webViewRef.current?.injectJavaScript(LINKEDIN_SCRAPING_SCRIPT);
          }
          break;

        case "PROFILE_DATA":
  if (data.profile) {
    try {
      await saveProfile(data.profile);
      onProfileScraped(data.profile);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
      // Ajouter une notification d'erreur ici
    }
  }
  break;

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#4247BD" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>LinkedIn</Text>
        </View>

        <WebView
          ref={webViewRef}
          source={{ uri: profileUrl }}
          injectedJavaScript={LINKEDIN_LOGIN_SCRIPT}
          onMessage={handleMessage}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          style={styles.webview}
        />

        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#4247BD" />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#4247BD",
    marginLeft: 15,
  },
  webview: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});
