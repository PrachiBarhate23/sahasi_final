import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // ✅ added import

const Header = ({ theme = 'light' }) => { 
  const navigation = useNavigation(); // ✅ ensures navigation always works
  const isDarkMode = theme === 'dark';

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      paddingTop: 20,
      shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.4 : 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    appName: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#8B5CF6',
      letterSpacing: 0.5,
      marginRight: 4,
    },
    iconColor: isDarkMode ? '#FFFFFF' : '#000000',
  });

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleSettingsPress = () => {
    navigation.navigate('SettingsScreen'); // ✅ now always has navigation
  };

  return (
    <View style={dynamicStyles.container}>
      {/* Left side - Logo and App Name */}
      <View style={styles.leftSection}>
        <Image
          source={require('../../assets/loading_pic.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={dynamicStyles.appName}>Sahasi</Text>
      </View>

      {/* Right side - Icons */}
      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Icon name="notifications-outline" size={24} color={dynamicStyles.iconColor} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <Icon name="settings-outline" size={24} color={dynamicStyles.iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Keep static styles outside
const styles = StyleSheet.create({
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
  },
});

export default Header;
