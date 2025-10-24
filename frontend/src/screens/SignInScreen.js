import React, { useState } from 'react';
import { loginUser } from '../api'; // adjust path if needed

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Import your illustration image from the assets folder.
const loadingPic = require('../../assets/loading_pic.png');

const SignInScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // Added state for error messages

  const handleLogin = async () => {
    setLoginError(''); // reset error on each login attempt

    if (!emailOrUsername || !password) {
      setLoginError('Please fill all fields');
      return;
    }

    try {
      const response = await loginUser(emailOrUsername, password);

      if (response.ok) {
        console.log('Login successful:', response.data);
        navigation.replace('HomeScreen'); // navigate on success
      } else {
        setLoginError(response.data.detail || 'Login failed');
      }
    } catch (error) {
      setLoginError('Network error');
      console.error('Login error:', error.message);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password pressed');
    // if (navigation) {
    //   navigation.navigate('ForgotPasswordScreen');
    // }
  };

  const handleSignUp = () => {
    if (navigation) {
      navigation.navigate('SignUpScreen');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={loadingPic}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Sahasi</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Display login error */}
          {loginError !== '' && (
            <Text style={styles.errorText}>{loginError}</Text>
          )}

          {/* Email/Username Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email / Username</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email or username"
              placeholderTextColor="#A0AEC0"
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor="#A0AEC0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Forgot Password Link */}
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          {/* Log In Button */}
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustrationImage: {
    width: width * 0.6,
    height: undefined,
    aspectRatio: 1.15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A202C',
    letterSpacing: -0.5,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 8,
  },
  textInput: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3748',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 16,
    color: '#4A5568',
  },
  signUpLink: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default SignInScreen;
