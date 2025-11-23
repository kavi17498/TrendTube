import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login/login');
  };

  const handleMoviesTest = () => {
    router.push('/movies/movies');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="movie" size={100} color="#007AFF" />
        </View>
        
        <Text style={styles.title}>TrendTube</Text>
        <Text style={styles.tagline}>Your Ultimate Movie Discovery</Text>
        <Text style={styles.subtitle}>Stream • Discover • Enjoy</Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.featureItem}>
          <MaterialIcons name="search" size={28} color="#007AFF" />
          <Text style={styles.featureText}>Discover</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="favorite" size={28} color="#ff4757" />
          <Text style={styles.featureText}>Favorites</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="filter-list" size={28} color="#2ed573" />
          <Text style={styles.featureText}>Filters</Text>
        </View>
      </View>

      {/* Action Section */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>
        
        <Text style={styles.footerText}>Join thousands of movie lovers worldwide</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
  },
  heroSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  iconContainer: {
    backgroundColor: '#fff',
    borderRadius: 70,
    padding: 25,
    marginBottom: 40,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: '#a8a8a8',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '600',
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 40,
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 90,
    borderWidth: 1,
    borderColor: '#2a3b5c',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  featureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  actionSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
