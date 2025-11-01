import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 🔹 Old app screens
import SplashScreen from './src/screens/SplashScreen';
import ProfileCompletedScreen from './src/screens/ProfileCompletedScreen';
import HomePage from './src/screens/HomePage';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
<<<<<<< HEAD
import MapViewWeb from './src/components/MapViewWeb'; // ✅ fixed import
import MapPage from './src/screens/MapPage'; // your mobile map page
=======
import MapPage from './src/screens/MapPage';
>>>>>>> fd0f84ebedd77e77686635c7a9ae5ca93652c7ba
import PanicModeScreen from './src/screens/PanicModeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ProfileSettingsScreen } from './src/screens/ProfileSettingsScreen';
import { AppReferenceScreen } from './src/screens/AppReferenceScreen';
import { FakeCallSetupScreen } from './src/screens/FakeCallSetupScreen';
import { TrustedContactsScreen } from './src/screens/TrustedContactsScreen';

// 🔹 New chat system screens
import ContactsList from './src/screens/ContactsList';
import ChatInterface from './src/screens/ChatInterface';

const Stack = createStackNavigator();

const App = () => {
  // Decide which map screen to use based on platform
  const MapScreen = Platform.OS === 'web' ? MapViewWeb : MapPage;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* === Original Screens === */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          initialParams={{ theme: 'light' }}
        />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />

        {/* Map Screen - auto selects web/mobile version */}
        <Stack.Screen name="MapScreen" component={MapScreen} />

        <Stack.Screen name="PanicMode" component={PanicModeScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
        <Stack.Screen name="FakeCallSetup" component={FakeCallSetupScreen} />
        <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} />
        <Stack.Screen name="AppReference" component={AppReferenceScreen} />
        <Stack.Screen name="ProfileCompletedScreen" component={ProfileCompletedScreen} />
<<<<<<< HEAD
=======

        {/* === New Chat Screens === */}
        <Stack.Screen name="ContactsList" component={ContactsList} />
        <Stack.Screen name="ChatInterface" component={ChatInterface} />
>>>>>>> fd0f84ebedd77e77686635c7a9ae5ca93652c7ba
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
