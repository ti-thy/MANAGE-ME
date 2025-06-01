 import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Fetch user data to confirm token validity
          const response = await fetch('http://localhost:3000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const user = await response.json();
            setTimeout(() => {
              navigation.replace('Calendar', { userId: user.id, username: user.username });
            }, 2000); // Delay for splash screen display
          } else {
            await AsyncStorage.removeItem('token'); // Clear invalid token
            setTimeout(() => {
              navigation.replace('Login');
            }, 2000);
          }
        } else {
          setTimeout(() => {
            navigation.replace('Login');
          }, 2000);
        }
      } catch (error) {
        console.error('SplashScreen auth check error:', error);
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#26A69A', '#4DB6AC']}
        style={styles.gradient}
      >
        <Animatable.View animation="bounceIn" duration={1500} style={styles.content}>
          <Icon name="calendar" size={100} color="#fff" style={styles.icon} />
          <Text style={styles.title}>manageME</Text>
          <Text style={styles.subtitle}>Organize Your Events Seamlessly</Text>
          <Animatable.Text animation="pulse" iterationCount="infinite" style={styles.loadingText}>
            Loading...
          </Animatable.Text>
        </Animatable.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
  },
});

export default SplashScreen;