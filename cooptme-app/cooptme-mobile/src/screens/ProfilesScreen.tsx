import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Menu, MapPin, Building2 } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { generateContacts, Contact, categories } from './ProfileGenerator';
import { TabParamList } from '../../App';

const windowWidth = Dimensions.get('window').width;

// Générer 100 contacts de test
const contacts = generateContacts(100);

type ProfilesScreenNavigationProp = NativeStackNavigationProp<TabParamList>;

export default function ProfilesScreen() {
  const navigation = useNavigation<ProfilesScreenNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCategoryPress = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
  };

  const handleContactPress = (contact: Contact) => {
    navigation.navigate('ProfileDetail', { contact } as never);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => {
    const count = contacts.filter(contact => contact.category === item.title).length;

    return (
      <TouchableOpacity
        style={[styles.categoryCard, { width: (windowWidth - 50) / 2 }]}
        onPress={() => handleCategoryPress(item.title)}
      >
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categoryCount}>{count} contacts</Text>
      </TouchableOpacity>
    );
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => handleContactPress(item)}
    >
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: item.photo }}
          style={styles.photo}
          defaultSource={require('../../assets/default-avatar.png')}
        />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.function}>{item.function}</Text>
        <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <Building2 size={12} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.company}</Text>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={12} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{item.meetingPlace}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (selectedCategory) {
      return (
        <FlatList
          key="contactsList"
          data={contacts.filter(contact => contact.category === selectedCategory)}
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      );
    } else {
      return (
        <FlatList
          key="categoriesGrid"
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.categoryRow}
          contentContainerStyle={styles.categoriesList}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Menu color="#4247BD" size={24} />
        </TouchableOpacity>
        {selectedCategory && (
          <TouchableOpacity onPress={handleBackToCategories} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour aux catégories</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {selectedCategory ? selectedCategory : 'Catégories'}
        </Text>
        {renderContent()}
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
  backButton: {
    marginLeft: 20,
  },
  backButtonText: {
    color: '#4247BD',
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
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
  categoriesList: {
    paddingBottom: 20,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  categoryTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    color: '#4247BD',
    marginBottom: 5,
  },
  categoryCount: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 12,
    color: '#666',
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
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    marginBottom: 8,
  },
  additionalInfo: {
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 12,
    color: '#666',
  },
});