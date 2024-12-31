import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Menu, MapPin } from "lucide-react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { generateContacts, Contact, categories } from "./ProfileGenerator";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const windowWidth = Dimensions.get("window").width;

// Générer 100 contacts de test
const contacts = generateContacts(100);

type RootStackParamList = {
  ProfileDetail: { contact: Contact };
};

type ProfilesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileDetail'
>;

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
    navigation.navigate('ProfileDetail', { contact });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const renderCategoryItem = ({ item }: { item: (typeof categories)[0] }) => {
    const count = contacts.filter(
      (contact) => contact.category === item.title
    ).length;

    return (
      <TouchableOpacity
        style={styles.categoryCard}
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
      {item.photo ? (
        <Image
          source={{ uri: item.photo }}
          style={styles.photo}
          defaultSource={require('../../assets/default-avatar.png')}
        />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>
            {item.firstName[0]}{item.lastName[0]}
          </Text>
        </View>
      )}
      <View style={styles.meetingBadge}>
        <MapPin size={12} color="#FFFFFF" />
        <Text style={styles.meetingBadgeText} numberOfLines={1}>
          {item.meetingPlace}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Menu color="#4247BD" size={24} />
        </TouchableOpacity>
        {selectedCategory && (
          <TouchableOpacity
            onPress={handleBackToCategories}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Retour aux catégories</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {selectedCategory ? selectedCategory : "Catégories"}
        </Text>

        {selectedCategory ? (
          // Liste des contacts de la catégorie sélectionnée
          <FlatList
            data={contacts.filter(
              (contact) => contact.category === selectedCategory
            )}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          // Grille des catégories
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.categoriesList}
          />
        )}
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
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    width: "100%",
  },
  categoryCard: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    width: (windowWidth - 50) / 2,
  },
  categoryTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: "#4247BD",
    marginBottom: 5,
  },
  categoryCount: {
    fontFamily: "Quicksand-Regular",
    fontSize: 12,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 20,
  },
  contactCard: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
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
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#4247BD",
  },
  contactInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  function: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  meetingPlace: {
    fontFamily: "Quicksand-Regular",
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  category: {
    fontFamily: "Quicksand-Regular",
    fontSize: 12,
    color: "#4247BD",
  },
  meetingBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#4247BD',
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 100,
  },
  meetingBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 2,
    fontFamily: 'Quicksand-Medium',
  },
  backButton: {
    marginLeft: 20,
  },
  backButtonText: {
    color: '#4247BD',
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
  },
});
