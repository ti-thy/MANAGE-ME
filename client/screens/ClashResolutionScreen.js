import { LinearGradient } from 'expo-linear-gradient';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button } from 'react-native-elements';
import EventCard from '../components/EventCard';

const ClashResolutionScreen = ({ route, navigation }) => {
  const { clashes } = route.params;

  const handleResolve = (selectedEvent) => {
    Alert.alert('Event Selected', `You chose: ${selectedEvent.summary}. Event scheduled successfully!`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#26A69A', '#4DB6AC']}
        style={styles.header}
      >
        <Text style={styles.title}>Resolve Event Clashes</Text>
      </LinearGradient>

      <Animatable.View animation="fadeInUp" duration={1000} style={styles.content}>
        {clashes.map((clash, index) => (
          <View key={index} style={styles.clashGroup}>
            <Text style={styles.clashText}>Clash {index + 1}</Text>
            <EventCard event={clash[0]} />
            <LinearGradient
              colors={['#FFCA28', '#FFB300']}
              style={styles.buttonGradient}
            >
              <Button
                title={`Choose ${clash[0].summary}`}
                onPress={() => handleResolve(clash[0])}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
              />
            </LinearGradient>
            <EventCard event={clash[1]} />
            <LinearGradient
              colors={['#FFCA28', '#FFB300']}
              style={styles.buttonGradient}
            >
              <Button
                title={`Choose ${clash[1].summary}`}
                onPress={() => handleResolve(clash[1])}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
              />
            </LinearGradient>
          </View>
        ))}
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  clashGroup: {
    marginBottom: 30,
  },
  clashText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  buttonGradient: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ClashResolutionScreen;