import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-elements';

const ClashDrawerScreen = ({ route, navigation }) => {
  const { clashes } = route.params || { clashes: [] };

  // Handle navigation to ClashResolutionScreen
  const handleResolveClash = (clash) => {
    navigation.navigate('ClashResolution', { clashes: [clash] });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#26A69A', '#4DB6AC']}
        style={styles.header}
      >
        <Text style={styles.title}>Event Clashes</Text>
      </LinearGradient>

      <View style={styles.content}>
        {clashes.length === 0 ? (
          <Text style={styles.noClashes}>No clashes detected.</Text>
        ) : (
          <ScrollView>
            {clashes.map((clash, index) => (
              <Card key={index} containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>Clash {index + 1}</Card.Title>
                <Card.Divider />
                <Text style={styles.eventText}>
                  Event 1: {clash[0].summary}
                </Text>
                <Text style={styles.eventText}>
                  Time: {format(new Date(clash[0].start.dateTime || clash[0].start.date), 'MMM d, yyyy h:mm a')} - {format(new Date(clash[0].end.dateTime || clash[0].end.date), 'h:mm a')}
                </Text>
                <Text style={styles.eventText}>
                  Source: {clash[0].creator?.email || 'Unknown'}
                </Text>
                <Text style={styles.eventText}>
                  Event 2: {clash[1].summary}
                </Text>
                <Text style={styles.eventText}>
                  Time: {format(new Date(clash[1].start.dateTime || clash[1].start.date), 'MMM d, yyyy h:mm a')} - {format(new Date(clash[1].end.dateTime || clash[1].end.date), 'h:mm a')}
                </Text>
                <Text style={styles.eventText}>
                  Source: {clash[1].creator?.email || 'Unknown'}
                </Text>
                <TouchableOpacity
                  style={styles.resolveButton}
                  onPress={() => handleResolveClash(clash)}
                >
                  <Text style={styles.resolveButtonText}>Resolve This Clash</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </ScrollView>
        )}
      </View>
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
  noClashes: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  eventText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resolveButton: {
    backgroundColor: '#FFCA28',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  resolveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ClashDrawerScreen;