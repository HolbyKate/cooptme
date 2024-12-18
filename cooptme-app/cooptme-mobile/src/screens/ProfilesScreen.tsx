import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { Menu, Users, X } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import WebView from 'react-native-webview';
import { DrawerParamList, TabParamList } from '../../App';
import {
  LinkedInProfile,
  LINKEDIN_INJECTION_SCRIPT,
  saveLinkedInProfile,
  getLinkedInProfiles
} from '../utils/linkedinScraper';


type Category = {
  id: string;
  title: string;
  count: number;
};
type Props = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, 'ProfilesDrawer'>,
  NativeStackScreenProps<TabParamList>
>;

const categories: Category[] = [
  { id: '1', title: 'IT', count: 145 },
  { id: '2', title: 'Marketing', count: 89 },
  { id: '3', title: 'RH', count: 67 },
  { id: '4', title: 'Finance', count: 54 },
  { id: '5', title: 'Communication', count: 78 },
  { id: '6', title: 'Students', count: 234 },
  { id: '7', title: 'Project Manager', count: 45 },
  { id: '8', title: 'Product Owner', count: 32 },
  { id: '9', title: 'Customer Care Manager', count: 28 },
];
export default function ProfilesScreen({ navigation, route }: DrawerScreenProps<DrawerParamList, 'ProfilesDrawer'>) {
  const linkedInUrl = route.params?.linkedInUrl ?? undefined;
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [scannedProfiles, setScannedProfiles] = useState<LinkedInProfile[]>([]);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    loadScannedProfiles();
  }, []);

  useEffect(() => {
    if (linkedInUrl) {
      setIsWebViewVisible(true);
    }
  }, [linkedInUrl]);

  const loadScannedProfiles = async () => {
    try {
      const profiles = await getLinkedInProfiles();
      setScannedProfiles(profiles);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    }
  };

  const handleLinkedInProfile = async (profileData: LinkedInProfile) => {
    try {
      await saveLinkedInProfile(profileData);
      await loadScannedProfiles();
      setIsWebViewVisible(false);
      Alert.alert('Succès', 'Profil LinkedIn enregistré avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le profil');
    }
  };

  const handleWebViewMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.error) {
        Alert.alert('Erreur', 'Impossible d\'extraire les informations du profil');
        setIsWebViewVisible(false);
        return;
      }
      handleLinkedInProfile(data);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du traitement du profil');
      setIsWebViewVisible(false);
    }
  };

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
  };

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

      <View style={styles.content}>
        <Text style={styles.title}>Profils</Text>
        <Text style={styles.subtitle}>Découvrez les profils par catégorie</Text>

        {scannedProfiles.length > 0 && (
          <View style={styles.scannedProfilesSection}>
            <Text style={styles.sectionTitle}>Profils scannés récemment</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recentProfilesScroll}
            >
              {scannedProfiles.map((profile) => (
                <TouchableOpacity
                  key={profile.id}
                  style={styles.profileCard}
                  onPress={() => {/* Navigation vers détails */}}
                >
                  <Text style={styles.profileName}>
                    {profile.firstName} {profile.lastName}
                  </Text>
                  <Text style={styles.profileTitle}>{profile.title}</Text>
                  <Text style={styles.profileCompany}>{profile.company}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Users color="#4247BD" size={24} />
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryCount}>{category.count} profils</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={isWebViewVisible}
        animationType="slide"
        onRequestClose={() => setIsWebViewVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsWebViewVisible(false)}
              style={styles.closeButton}
            >
              <X color="#4247BD" size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Analyser le profil</Text>
          </View>

          <WebView
            ref={webViewRef}
            source={{ uri: linkedInUrl || '' }}
            injectedJavaScript={LINKEDIN_INJECTION_SCRIPT}
            onMessage={handleWebViewMessage}
            onError={() => {
              Alert.alert('Erreur', 'Impossible de charger le profil');
              setIsWebViewVisible(false);
            }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Styles existants
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    color: '#4247BD',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 5,
  },
  categoryTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#666',
  },

  // Nouveaux styles pour LinkedIn
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    color: '#4247BD',
    marginLeft: 15,
  },
  scannedProfilesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    color: '#4247BD',
    marginBottom: 15,
  },
  recentProfilesScroll: {
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileName: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  profileTitle: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  profileCompany: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 12,
    color: '#999',
  },
});