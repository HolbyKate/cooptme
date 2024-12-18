// src/components/LinkedInLogin.tsx
import React, { useRef } from "react";
import { Modal, StyleSheet, View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { saveLinkedInAuth, LinkedInAuth } from "../utils/linkedinScraper";

interface LinkedInLoginProps {
  visible: boolean;
  onLoginSuccess: () => void;
  onClose: () => void;
}

const LINKEDIN_LOGIN_CHECK = `
(function() {
  const nav = document.querySelector('.nav');
  if (nav) {
    const cookies = document.cookie;
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'LOGIN_SUCCESS',
      cookies: cookies
    }));
  }
})();
`;

const LinkedInLogin: React.FC<LinkedInLoginProps> = ({
  visible,
  onLoginSuccess,
  onClose,
}) => {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "LOGIN_SUCCESS") {
        await saveLinkedInAuth({
          isLoggedIn: true,
          cookies: data.cookies,
        });
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Erreur lors du traitement du message:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: "https://www.linkedin.com/login" }}
          injectedJavaScript={LINKEDIN_LOGIN_CHECK}
          onMessage={handleMessage}
          style={styles.webview}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default LinkedInLogin;
