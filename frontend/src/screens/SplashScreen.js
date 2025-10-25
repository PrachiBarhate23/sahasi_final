import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const womanIllustration = require('../../assets/loading_pic.png');

const SplashScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Attempt to get the user's authentication token from storage.
        const userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          // If a token exists, the user is signed in. Navigate to the home screen.
          navigation.replace('HomePage');
        } else {
          // If no token exists, it's either the first download or the user logged out.
          // In this case, we simply stop the loading state, which will show the buttons.
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to check user status:', error);
        // On error, we still want to show the buttons so the user can log in.
        setLoading(false);
      }
    };
    
    // Use a small delay for a better user experience, allowing the splash screen to be visible for a moment.
    const splashTimer = setTimeout(() => {
        checkUserStatus();
    }, 1500);

    return () => clearTimeout(splashTimer);
  }, [navigation]);

  if (loading) {
    // Show a basic loading screen while the app is checking the token.
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.contentWrapper}>
          <Image
            source={womanIllustration}
            style={styles.illustration}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.appTitle}>Sahasi</Text>
            <Text style={styles.tagline}>Empowering women's safety</Text>
          </View>
        </View>
        <ActivityIndicator size="large" color="#8B5CF6" style={styles.loadingIndicator} />
      </View>
    );
  }

  // Once loading is false, render the screen with the buttons.
  // This state is reached for both first-time users and those who have logged out.
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.contentWrapper}>
        <Image
          source={womanIllustration}
          style={styles.illustration}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.appTitle}>Sahasi</Text>
          <Text style={styles.tagline}>Empowering women's safety</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.socialButtonsRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => console.log('Google sign-in pressed')}
            activeOpacity={0.7}
          >
            <Text style={styles.socialButtonText}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => console.log('Phone sign-in pressed')}
            activeOpacity={0.7}
          >
            <Text style={styles.phoneIcon}>📞</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('OnboardingScreen')}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>Get started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: width * 0.9,
    height: undefined,
    aspectRatio: 1.15,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  socialButton: {
    width: 56,
    height: 56,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  phoneIcon: {
    fontSize: 20,
    color: '#4A5568',
  },
  getStartedButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#C4B5FD',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: width * 0.7,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 80,
  }
});

export default SplashScreen;