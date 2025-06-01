import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Handle OAuth redirect URL in React Native
  useEffect(() => {
    const handleOAuthRedirect = async (event) => {
      const { url } = event;
      if (url.startsWith('http://localhost:3000')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const token = urlParams.get('token');
        if (token) {
          try {
            await AsyncStorage.setItem('token', token);
            const response = await fetch('http://localhost:3000/api/users/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const user = await response.json();
            if (response.ok) {
              Alert.alert('Success', 'Logged in with Google successfully!');
              navigation.navigate('Calendar', { userId: user.id, username: user.username });
            } else {
              throw new Error('Failed to fetch user data');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to handle Google login');
          }
        }
      }
    };

    Linking.addEventListener('url', handleOAuthRedirect);
    Linking.getInitialURL().then(url => {
      if (url) handleOAuthRedirect({ url });
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [navigation]);

  const handleLogin = async () => {
    if (!username || !email) {
      Alert.alert('Error', 'Please enter both username and email');
      return;
    }

    try {
      // Attempt to login
      let response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'defaultPassword123' })
      });

      if (response.ok) {
        const user = await response.json();
        await AsyncStorage.setItem('token', user.token);
        Alert.alert('Success', 'Logged in successfully!');
        navigation.navigate('Calendar', { userId: user.user.id, username: user.user.username });
      } else if (response.status === 401) {
        // If login fails, attempt signup
        response = await fetch('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password: 'defaultPassword123' })
        });

        if (response.ok) {
          // Retry login after signup
          response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'defaultPassword123' })
          });

          if (response.ok) {
            const user = await response.json();
            await AsyncStorage.setItem('token', user.token);
            Alert.alert(
              'Success',
              'Account created successfully! For future logins, use the password: defaultPassword123',
              [{ text: 'OK', onPress: () => navigation.navigate('Calendar', { userId: user.user.id, username: user.user.username }) }]
            );
          } else {
            throw new Error('Failed to login after signup');
          }
        } else {
          throw new Error('Failed to create account');
        }
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create/login account: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await Linking.openURL('http://localhost:3000/api/auth/google');
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate Google login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#26A69A', '#4DB6AC']}
        style={styles.header}
      >
        <Animatable.View animation="bounceIn" duration={1500}>
          <Icon name="account-circle" size={100} color="#fff" style={styles.icon} />
        </Animatable.View>
      </LinearGradient>

      {/* Form Container */}
      <Animatable.View animation="fadeInUp" duration={1000} style={styles.formContainer}>
        <Input
          placeholder="Username"
          leftIcon={{ type: 'material-community', name: 'account', color: '#26A69A' }}
          value={username}
          onChangeText={setUsername}
          containerStyle={styles.input}
          inputStyle={styles.inputText}
          placeholderTextColor="#666"
        />
        <Input
          placeholder="Email"
          leftIcon={{ type: 'material-community', name: 'email', color: '#26A69A' }}
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.input}
          inputStyle={styles.inputText}
          placeholderTextColor="#666"
        />
        <LinearGradient
          colors={['#FFCA28', '#FFB300']}
          style={styles.buttonGradient}
        >
          <Button
            title="Login / Sign Up"
            onPress={handleLogin}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </LinearGradient>
        <LinearGradient
          colors={['#FFCA28', '#FFB300']}
          style={[styles.buttonGradient, { marginTop: 10 }]}
        >
          <Button
            title="Sign in with Google"
            onPress={handleGoogleLogin}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            icon={{ type: 'material-community', name: 'google', color: '#333', size: 20, marginRight: 10 }}
          />
        </LinearGradient>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    alignSelf: 'center',
  },
  formContainer: {
    marginHorizontal: 20,
    marginTop: -30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  input: {
    marginBottom: 20,
  },
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  buttonGradient: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default LoginScreen;