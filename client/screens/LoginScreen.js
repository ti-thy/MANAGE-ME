import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginUser } from '../shared/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    try {
      const response = await loginUser(email, password);
      await AsyncStorage.setItem('token', response.token);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('Calendar', { userId: response.user.id, username: response.user.username });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to login');
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
          placeholder="Email"
          leftIcon={{ type: 'material-community', name: 'email', color: '#26A69A' }}
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.input}
          inputStyle={styles.inputText}
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: 'material-community', name: 'lock', color: '#26A69A' }}
          value={password}
          onChangeText={setPassword}
          containerStyle={styles.input}
          inputStyle={styles.inputText}
          placeholderTextColor="#666"
          secureTextEntry
        />
        <LinearGradient
          colors={['#FFCA28', '#FFB300']}
          style={styles.buttonGradient}
        >
          <Button
            title="Login"
            onPress={handleLogin}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
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