import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ theme = 'light' }) => {
  const navigation = useNavigation();
  const isDarkMode = theme === 'dark';

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleSettingsPress = () => {
    navigation.navigate('SettingsScreen');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
          shadowOpacity: isDarkMode ? 0.4 : 0.25,
        },
      ]}
    >
      {/* Left side */}
      <View style={styles.leftSection}>
        <Image
          source={require('../../assets/loading_pic.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: '#8B5CF6' }]}>Sahasi</Text>
      </View>

      {/* Right side */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Icon
            name="notifications-outline"
            size={24}
            color={isDarkMode ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <Icon
            name="settings-outline"
            size={24}
            color={isDarkMode ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 40,
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logo: { width: 45, height: 45, marginRight: 12 },
  appName: { fontSize: 25, fontWeight: 'bold', letterSpacing: 0.5 },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8, marginLeft: 8, borderRadius: 20 },
});

export default Header;
