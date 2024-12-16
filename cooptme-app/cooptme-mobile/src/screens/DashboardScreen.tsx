import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const menuItems = [
  { id: 1, title: 'Contacts', screen: 'Contacts' },
  { id: 2, title: 'Profiles', screen: 'Profiles' },
  { id: 3, title: 'Events', screen: 'Events' },
  { id: 4, title: 'Calendar', screen: 'Calendar' },
  { id: 5, title: 'Chat', screen: 'Chat' },
  { id: 6, title: 'Job Offers', screen: 'JobOffers' },
];

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleMenuPress = () => {
    // Implement menu logic
    console.log('Menu pressed');
  };

  return (
    <View style={styles.container}>
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

      <ScrollView style={styles.content}>
        <View style={styles.newsletterSection}>
          <Text style={styles.sectionTitle}>Newsletters</Text>
          {/* Add newsletter content here */}
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  newsletterSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    color: '#4247BD',
    marginBottom: 15,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    color: '#4247BD',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#FF8F66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  scanButtonText: {
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});
