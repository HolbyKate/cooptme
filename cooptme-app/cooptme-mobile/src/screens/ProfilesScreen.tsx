import React, { useEffect, useState } from 'react';
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
import { Menu, Users, X } from 'lucide-react-native';
import { DrawerActions, CompositeScreenProps } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerParamList, TabParamList } from '../../App';
import LinkedInBrowser from '../components/LinkedInBrowser';
import {
  LinkedInProfile,
  getProfiles,
} from '../utils/linkedinScraper';

// Définition des types
type Props = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, 'ProfilesDrawer'>,
  NativeStackScreenProps<TabParamList>
>;

type Category = {
  id: string;
  title: string;
  count: number;
};

// Données des catégories
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

export default function ProfilesScreen({ navigation, route }: Props) {
  // États
  const linkedInUrl = route.params?.linkedInUrl;
  const [isLinkedInBrowserVisible, setIsLinkedInBrowserVisible] = useState(false);
  const [scannedProfiles, setScannedProfiles] = useState<LinkedInProfile[]>([]);

  // Effets
  useEffect(() => {
    loadScannedProfiles();
  }, []);

  useEffect(() => {
    if (linkedInUrl) {
      setIsLinkedInBrowserVisible(true);
    }
  }, [linkedInUrl]);

  // Gestionnaires d'événements
  const loadScannedProfiles = async () => {
    try {
      const profiles = await getProfiles();
      setScannedProfiles(profiles);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    }
  };

  const handleProfileScraped = async (profile: LinkedInProfile) => {
    Alert.alert('Succès', 'Profil LinkedIn enregistré avec succès');
    setIsLinkedInBrowserVisible(false);
    await loadScannedProfiles();
  };

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
  };

  const handleProfilePress = (profile: LinkedInProfile) => {
    // TODO: Implémenter la navigation vers les détails du profil
    console.log('Profile pressed:', profile.id);
  };

  // Rendu
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

        {/* Section des profils scannés */}
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
                  onPress={() => handleProfilePress(profile)}
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

        {/* Grille des catégories */}
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

      {/* LinkedIn Browser Modal */}
      <LinkedInBrowser
        isVisible={isLinkedInBrowserVisible}
        profileUrl={linkedInUrl || ''}
        onClose={() => setIsLinkedInBrowserVisible(false)}
        onProfileScraped={handleProfileScraped}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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