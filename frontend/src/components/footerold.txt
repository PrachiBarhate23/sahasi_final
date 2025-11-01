import React, { useState } from 'react';
import { Vibration, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FakeCallScreen from '../screens/FakeCallScreen';

const Footer = ({ theme = 'dark', navigation }) => {
  const isDarkMode = theme === 'dark';
  const [showCallScreen, setShowCallScreen] = useState(false);

  const handleHomePress = () => navigation.navigate('HomePage');
  const handleMapPress = () => navigation.navigate('MapPage');
  const handleSOSPress = () => {
    Vibration.vibrate(100);
    navigation.navigate('PanicMode');
  };

  const handleCameraPress = () => {
  console.log('Messages pressed');
  navigation.navigate('ContactsList'); // 👈 Opens chat system
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
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            shadowColor: isDarkMode ? '#FFFFFF' : '#000',
            shadowOpacity: isDarkMode ? 0.3 : 0.15,
          },
        ]}
      >
        <TouchableOpacity style={styles.iconButton} onPress={handleHomePress}>
          <Icon name="home-outline" size={24} color={isDarkMode ? '#E5E7EB' : '#6B7280'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleMapPress}>
          <Icon name="map-marker-radius-outline" size={24} color={isDarkMode ? '#E5E7EB' : '#6B7280'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        {/* message Icon */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleCameraPress}
          activeOpacity={0.7}
        >
          <Icon name="message-text-outline" size={24} color={dynamicStyles.iconColor} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handlePhonePress}>
          <Icon name="phone-outline" size={24} color={isDarkMode ? '#E5E7EB' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      <Modal visible={showCallScreen} animationType="fade" onRequestClose={handleEndCall} statusBarTranslucent>
        <FakeCallScreen callerName="Mom" callerSubtitle="Mobile" onEnd={handleEndCall} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconButton: { padding: 8, alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sosText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
});

export default Footer;
