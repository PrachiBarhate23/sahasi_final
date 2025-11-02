// ==================== SettingsScreen.jsx ====================
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions, 
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Footer from '../components/Footer';

const SettingsScreen = ({theme = 'light'}) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); 
  const isDark = theme === 'dark';

  const settingsOptions = [
    {
      id: 1,
      title: 'Profile Settings',
      icon: 'person',
      screen: 'ProfileSettings',
      description: 'Manage your personal information',
    },
    {
      id: 2,
      title: 'Fake Call Simulation Setup',
      icon: 'phone-in-talk',
      screen: 'FakeCallSetup',
      description: 'Configure fake call settings',
    },
    {
      id: 3,
      title: 'Trusted Contacts Setup',
      icon: 'contacts',
      screen: 'TrustedContacts',
      description: 'Add and manage emergency contacts',
    },
    {
      id: 4,
      title: 'App Reference',
      icon: 'info',
      screen: 'AppReference',
      description: 'Learn how to use the app',
    },
  ];

  const handleNavigation = (screen) => {
    navigation.navigate(screen, {theme}); 
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          console.log('User logged out');
          navigation.replace('SignInScreen');
        },
        style: 'destructive',
      },
    ]);
  };

  // Centralized Dynamic Styles
  const dynamicStyles = {
    safeArea: {
      backgroundColor: isDark ? '#111827' : '#F3F4F6',
    },
    headerTitle: {
      color: isDark ? '#F9FAFB' : '#111827',
    },
    card: {
      backgroundColor: isDark ? '#374151' : '#FFFFFF',
      shadowOpacity: isDark ? 0.3 : 0.1,
    },
    iconContainer: {
      backgroundColor: isDark ? '#4B5563' : '#F3F4F6',
    },
    iconColor: isDark ? '#F9FAFB' : '#111827',
    chevronColor: isDark ? '#9CA3AF' : '#9CA3AF',
    cardTitle: {
      color: isDark ? '#F9FAFB' : '#111827',
    },
    cardDescription: {
      color: isDark ? '#D1D5DB' : '#6B7280',
    },
    appInfoText: {
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
  };


  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        dynamicStyles.safeArea, // Apply dynamic background color
      ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={dynamicStyles.safeArea.backgroundColor}
      />
      
      {/* 1. 🚀 FIXED HEADER: Moved outside the ScrollView */}
      <View style={[styles.header, dynamicStyles.safeArea]}>
        <Text
          style={[
            styles.headerTitle,
            dynamicStyles.headerTitle,
          ]}>
          Settings
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer} // Padding is now only for the bottom
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.optionsContainer}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.card,
                dynamicStyles.card,
              ]}
              onPress={() => handleNavigation(option.screen)}
              activeOpacity={0.7}>
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    dynamicStyles.iconContainer,
                  ]}>
                  <Icon
                    name={option.icon}
                    size={28}
                    color={dynamicStyles.iconColor}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.cardTitle,
                      dynamicStyles.cardTitle,
                    ]}>
                    {option.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDescription,
                      dynamicStyles.cardDescription,
                    ]}>
                    {option.description}
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={24}
                  color={dynamicStyles.chevronColor}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <Icon name="logout" size={20} color="#FFFFFF" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.appInfo}>
          <Text
            style={[
              styles.appInfoText,
              dynamicStyles.appInfoText,
            ]}>
            Sahasi - Women Safety App
          </Text>
          <Text
            style={[
              styles.appInfoText,
              dynamicStyles.appInfoText,
            ]}>
            Made with ❤️ for women's safety
          </Text>
        </View>
      </ScrollView>

      <Footer theme={theme} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  // 🟢 UPDATED: Only bottom padding needed now, since the header is outside the ScrollView
  contentContainer: {
    paddingBottom: 100, 
  },
  // 🟢 UPDATED: Only top/horizontal padding needed for the fixed header bar
  header: {
    paddingTop: 45,
    paddingBottom: 16,
    paddingHorizontal: 16,
    // Ensures header is full width and has the correct background color
    width: '100%', 
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  optionsContainer: {
    paddingHorizontal: 16,
    // Optional: Add small margin top to separate content from the fixed header
    paddingTop: 16, 
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    flexDirection: 'row',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  appInfoText: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
});

export default SettingsScreen;