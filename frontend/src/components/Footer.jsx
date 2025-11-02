import React, { useState } from 'react';
import {
  Vibration,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import FakeCallScreen from '../screens/FakeCallScreen';

const Footer = () => {
  const navigation = useNavigation();
  const [showCallScreen, setShowCallScreen] = useState(false);

  // === Navigation handlers ===
  const handleHomePress = () => navigation.navigate('HomePage');
  const handleMapPress = () => navigation.navigate('MapPage');
  const handleSOSPress = () => {
    Vibration.vibrate(100);
    navigation.navigate('PanicMode');
  };

  // camera instead of messages
  const handleCameraPress = () => navigation.navigate('EmergencyMediaScreen');

  const handlePhonePress = () => setShowCallScreen(true);
  const handleEndCall = () => setShowCallScreen(false);

  const iconColor = '#6B7280';         // LIGHT default only
  const backgroundColor = '#FFFFFF';
  const shadowColor = '#000';

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            shadowColor,
            shadowOpacity: 0.15
          },
        ]}
      >
        <TouchableOpacity style={styles.iconButton} onPress={handleHomePress}>
          <Icon name="home-outline" size={24} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleMapPress}>
          <Icon name="map-marker-radius-outline" size={24} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        {/* CAMERA ICON */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleCameraPress}
          activeOpacity={0.7}
        >
          <Icon name="camera-outline" size={24} color={iconColor} />
        </TouchableOpacity>

        {/* Fake Call */}
        <TouchableOpacity style={styles.iconButton} onPress={handlePhonePress}>
          <Icon name="phone-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
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
    shadowOffset: { width: 0, height: 2 },
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
