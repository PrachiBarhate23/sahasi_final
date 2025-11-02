import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './src/screens/SplashScreen';
import ProfileCompletedScreen from './src/screens/ProfileCompletedScreen';
import HomePage from './src/screens/HomePage';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MapPage from './src/screens/MapPage';
import PanicModeScreen from './src/screens/PanicModeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ProfileSettingsScreen } from './src/screens/ProfileSettingsScreen';
import { AppReferenceScreen } from './src/screens/AppReferenceScreen';
import { FakeCallSetupScreen } from './src/screens/FakeCallSetupScreen';
import { TrustedContactsScreen } from './src/screens/TrustedContactsScreen';
import EmergencyMediaScreen from './src/screens/EmergencyMediaScreen';


const Stack = createStackNavigator();

const App = () => {
  // 🧭 Using only Android/iOS map screen
  // const MapScreen =
  //   Platform.OS === 'web'
  //     ? require('./src/screens/MapViewWeb').default
  //     : MapPage;

  // ✅ Always use mobile MapPage

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          initialParams={{ theme: 'light' }}
        />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="EmergencyMediaScreen" component={EmergencyMediaScreen} />

        {/* ✅ Always using MapPage */}
        <Stack.Screen name="MapPage" component={MapPage} />

        <Stack.Screen name="PanicMode" component={PanicModeScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
        <Stack.Screen name="FakeCallSetup" component={FakeCallSetupScreen} />
        <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} />
        <Stack.Screen name="AppReference" component={AppReferenceScreen} />
        <Stack.Screen name="ProfileCompletedScreen" component={ProfileCompletedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
