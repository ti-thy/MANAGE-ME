 import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CalendarScreen from './screens/CalendarScreen';
import ClashDrawerScreen from './screens/ClashDrawerScreen';
import ClashResolutionScreen from './screens/ClashResolutionScreen';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="ClashDrawer" component={ClashDrawerScreen} />
        <Stack.Screen name="ClashResolution" component={ClashResolutionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;