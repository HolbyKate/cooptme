import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Menu, Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Category = {
  id: string;
  title: string;
  count: number;
};

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

export default function ProfilesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleCategoryPress = (categoryId: string) => {
    // Navigation future vers la liste des profils de cette catégorie
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
});