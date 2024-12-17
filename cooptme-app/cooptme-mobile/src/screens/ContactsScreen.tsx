import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  function: string;
  meetingPlace: string;
  photo: string | null;
};

const contacts = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    function: 'Développeuse Full Stack',
    meetingPlace: 'Holberton School',
    photo: null,
  },
  // ... autres contacts
];

export default function ContactsScreen() {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactCard}>
      <View style={styles.photoContainer}>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>
            {item.firstName[0]}{item.lastName[0]}
          </Text>
        </View>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.function}>{item.function}</Text>
        <Text style={styles.meetingPlace}>{item.meetingPlace}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.title}>Contacts</Text>
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
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
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photoContainer: {
    marginRight: 15,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    color: '#4247BD',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  function: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  meetingPlace: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 12,
    color: '#999',
  },
});