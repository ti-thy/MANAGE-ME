 import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EventCard from '../components/EventCard';
import { detectClashes, fetchEvents } from '../shared/api';
import { EVENTS, USERS } from '../shared/mockData'; // Import USERS and EVENTS for initial selectedDate

const CalendarScreen = ({ route, navigation }) => {
  const { userId, username } = route.params; // Receive username from LoginScreen
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [clashes, setClashes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Find the earliest event date for the user
    const userEvents = EVENTS.filter(event => {
      const user = USERS.find(u => u.id === userId);
      return user.linkedEmails.includes(event.email);
    });
    if (userEvents.length > 0) {
      const earliestEvent = userEvents.reduce((earliest, event) => {
        return new Date(event.start) < new Date(earliest.start) ? event : earliest;
      });
      return earliestEvent.start.split('T')[0]; // e.g., '2025-04-20'
    }
    return new Date().toISOString().split('T')[0]; // Fallback to today
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const userEvents = await fetchEvents(userId);
        console.log('Fetched events for userId:', userId, userEvents);
        setEvents(userEvents);

        const marked = {};
        userEvents.forEach(event => {
          const date = event.start.split('T')[0];
          marked[date] = { marked: true, dotColor: '#FFCA28' };
        });
        console.log('Marked dates:', marked);
        setMarkedDates(marked);

        const detectedClashes = detectClashes(userEvents);
        console.log('Detected clashes:', detectedClashes);
        setClashes(detectedClashes);

        if (detectedClashes.length > 0) {
          const clashDetails = detectedClashes.map((clash, index) => {
            const event1 = clash[0];
            const event2 = clash[1];
            return `Clash ${index + 1}: ${event1.summary} (${event1.start} - ${event1.end}) vs ${event2.summary} (${event2.start} - ${event2.end})`;
          }).join('\n');
          
          Alert.alert(
            'Event Clashes Detected',
            `The following events are clashing:\n${clashDetails}`,
            [
              { text: 'Resolve', onPress: () => navigation.navigate('ClashResolution', { clashes: detectedClashes }) },
              { text: 'View in Drawer', onPress: () => navigation.navigate('ClashDrawer', { clashes: detectedClashes }) },
              { text: 'Ignore', onPress: () => {} },
            ]
          );
        } else {
          Alert.alert('Events Synced', 'Your events have been synchronized successfully!');
        }
      } catch (error) {
        console.error('Error loading events:', error);
        Alert.alert('Error', 'Failed to load events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, [userId, navigation]);

  const filteredEvents = events.filter(event => {
    const eventDate = event.start.split('T')[0];
    return eventDate === selectedDate;
  });

  const openClashDrawer = () => {
    if (isLoading) {
      Alert.alert('Loading', 'Please wait until events are loaded.');
      return;
    }
    navigation.navigate('ClashDrawer', { clashes });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#26A69A', '#4DB6AC']}
        style={styles.header}
      >
        <Animatable.View animation="fadeIn" duration={1000} style={styles.headerContent}>
          <Icon
            name="menu"
            size={30}
            color="#fff"
            onPress={() => {
              navigation.openDrawer();
              openClashDrawer();
            }}
            style={styles.menuIcon}
          />
          <View>
            <Text style={styles.title}>
              <Icon name="calendar" size={30} color="#fff" /> Event Calendar
            </Text>
            <Text style={styles.subtitle}>Welcome, {username}!</Text>
          </View>
        </Animatable.View>
      </LinearGradient>

      <Animatable.View animation="fadeInUp" duration={1000} style={styles.content}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading events...</Text>
        ) : (
          <>
            <Calendar
              markedDates={markedDates}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              theme={{
                calendarBackground: '#fff',
                textSectionTitleColor: '#26A69A',
                selectedDayBackgroundColor: '#26A69A',
                selectedDayTextColor: '#fff',
                todayTextColor: '#FFCA28',
                dayTextColor: '#333',
                textDisabledColor: '#B0BEC5',
                arrowColor: '#26A69A',
              }}
              style={styles.calendar}
            />
            <ScrollView style={styles.eventList}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <Text style={styles.noEventsText}>No events on this day.</Text>
              )}
            </ScrollView>
          </>
        )}
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
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
  calendar: {
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  eventList: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CalendarScreen;