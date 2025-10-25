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
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Footer from '../components/Footer';

const SettingsScreen = ({theme = 'light'}) => {
  const navigation = useNavigation();
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
        // Navigate to SignIn screen and remove previous screens from stack
        navigation.replace('SignInScreen');
      },
      style: 'destructive',
    },
  ]);
};


  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: isDark ? '#111827' : '#F3F4F6'},
      ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#F3F4F6'}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              {color: isDark ? '#F9FAFB' : '#111827'},
            ]}>
            Settings
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 4,
                  shadowOffset: {width: 0, height: 2},
                  elevation: 3,
                },
              ]}
              onPress={() => handleNavigation(option.screen)}
              activeOpacity={0.7}>
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: isDark ? '#4B5563' : '#F3F4F6'},
                  ]}>
                  <Icon
                    name={option.icon}
                    size={28}
                    color={isDark ? '#F9FAFB' : '#111827'}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.cardTitle,
                      {color: isDark ? '#F9FAFB' : '#111827'},
                    ]}>
                    {option.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDescription,
                      {color: isDark ? '#D1D5DB' : '#6B7280'},
                    ]}>
                    {option.description}
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={24}
                  color={isDark ? '#9CA3AF' : '#9CA3AF'}
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
              {color: isDark ? '#9CA3AF' : '#6B7280'},
            ]}>
            Sahasi - Women Safety App
          </Text>
          <Text
            style={[
              styles.appInfoText,
              {color: isDark ? '#9CA3AF' : '#6B7280'},
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
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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