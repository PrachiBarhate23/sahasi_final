import React, { useState } from 'react';
import { Vibration } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
// Switched to MaterialCommunityIcons for consistency with MapPage
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import FakeCallScreen from '../screens/FakeCallScreen'; // Import the FakeCallScreen component
import PanicModeScreen from '../screens/PanicModeScreen';
import HomePage from '../screens/HomePage';

// IMPORTANT: This component now accepts an onNavigate prop to switch screens.
const Footer = ({ theme = 'dark', navigation }) => {
  const isDarkMode = theme === 'dark';
  const [showCallScreen, setShowCallScreen] = useState(false);

  // --- Navigation Handlers ---
  const handleHomePress = () => {
    navigation.navigate('HomePage');
    console.log('Home pressed');
  };

  const handleMapPress = () => {
    navigation.navigate('MapPage');
    console.log('Map pressed');
  };

  // ---------------------------

  const handleSOSPress = () => {
    Vibration.vibrate(100); // Small haptic feedback
    navigation.navigate('PanicMode'); // Navigate to PanicModeScreen
  };

  const handleCameraPress = () => {
    console.log('Camera pressed');
  };

  const handlePhonePress = () => {
    console.log('Phone pressed');
    setShowCallScreen(true); // Show the fake call screen
  };

  const handleEndCall = () => {
    console.log('Call ended');
    setShowCallScreen(false); // Hide the fake call screen
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: isDarkMode ? '#FFFFFF' : '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: isDarkMode ? 0.3 : 0.15,
      shadowRadius: 8,
      elevation: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    iconColor: isDarkMode ? '#E5E7EB' : '#6B7280',
    activeIconColor: isDarkMode ? '#10B981' : '#10B981', // Green for active/Map
  });

  return (
    <>
      <View style={dynamicStyles.container}>
        {/* Home Icon */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleHomePress}
          activeOpacity={0.7}
        >
          <Icon name="home-outline" size={24} color={dynamicStyles.iconColor} />
        </TouchableOpacity>

        {/* Map/Location Icon */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleMapPress}
          activeOpacity={0.7}
        >
          {/* Note: Switched to map-marker-radius for better visual pinpoint */}
          <Icon name="map-marker-radius-outline" size={24} color={dynamicStyles.iconColor} />
        </TouchableOpacity>

        {/* SOS Button - Bigger Red Circle */}
        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress} activeOpacity={0.8}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        {/* Camera Icon */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleCameraPress}
          activeOpacity={0.7}
        >
          <Icon name="camera-outline" size={24} color={dynamicStyles.iconColor} />
        </TouchableOpacity>

        {/* Phone/Call Icon */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handlePhonePress}
          activeOpacity={0.7}
        >
          <Icon name="phone-outline" size={24} color={dynamicStyles.iconColor} />
        </TouchableOpacity>
      </View>

      {/* Fake Call Screen Modal */}
      <Modal
        visible={showCallScreen}
        animationType="fade"
        onRequestClose={handleEndCall}
        statusBarTranslucent
      >
        <FakeCallScreen
          callerName="Mom"
          callerSubtitle="Mobile"
          onEnd={handleEndCall}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Footer;
