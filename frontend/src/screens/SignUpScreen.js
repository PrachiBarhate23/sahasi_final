import React, { useState } from 'react';
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
import { registerUser } from '../api'; // make sure this dynamically points to your backend

const { width } = Dimensions.get('window');
const loadingPic = require('../../assets/loading_pic.png');

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
const handleSignUp = async () => {
  if (password !== confirmPassword) {
    setSignUpError("Passwords do not match");
    return;
  }

  const response = await registerUser({
    first_name: firstName,     // <-- map frontend state
    last_name: lastName,       // <-- map frontend state
    phone: phoneNumber,        // <-- map frontend state
    email: email,
    username: username,
    password: password
  });

  if (response.ok) {
  // Save user info to AsyncStorage
  const userData = {
    firstName,
    lastName,
    phoneNumber,
    email,
    username,
  };
  await AsyncStorage.setItem('userData', JSON.stringify(userData));

  navigation.navigate("Login");
} else {
  setSignUpError(response.data.detail || "Registration failed");
}

};


  const handleLogIn = () => {
    navigation.navigate('SignInScreen');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.illustrationContainer}>
          <Image source={loadingPic} style={styles.illustrationImage} resizeMode="contain" />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Sahasi</Text>
        </View>

        <View style={styles.formContainer}>
          {signUpError !== '' && <Text style={styles.errorText}>{signUpError}</Text>}

          <View style={styles.nameRowContainer}>
            <View style={styles.nameInputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput style={styles.textInput} placeholder="Enter your first name" placeholderTextColor="#A0AEC0" value={firstName} onChangeText={setFirstName} autoCapitalize="words" autoCorrect={false} />
            </View>
            <View style={styles.nameInputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput style={styles.textInput} placeholder="Enter your last name" placeholderTextColor="#A0AEC0" value={lastName} onChangeText={setLastName} autoCapitalize="words" autoCorrect={false} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput style={styles.textInput} placeholder="Enter your phone number" placeholderTextColor="#A0AEC0" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" autoCorrect={false} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput style={styles.textInput} placeholder="Enter your email" placeholderTextColor="#A0AEC0" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput style={styles.textInput} placeholder="Create a username" placeholderTextColor="#A0AEC0" value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput style={styles.textInput} placeholder="Create a password" placeholderTextColor="#A0AEC0" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput style={styles.textInput} placeholder="Confirm password" placeholderTextColor="#A0AEC0" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} />
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.logInContainer}>
            <Text style={styles.logInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogIn}>
              <Text style={styles.logInLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 50, paddingBottom: 40 },
  illustrationContainer: { alignItems: 'center', marginBottom: 30 },
  illustrationImage: { width: width * 0.6, height: undefined, aspectRatio: 1.15 },
  titleContainer: { alignItems: 'center', marginBottom: 40 },
  appTitle: { fontSize: 36, fontWeight: 'bold', color: '#1A202C', letterSpacing: -0.5 },
  formContainer: { flex: 1 },
  nameRowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  nameInputContainer: { flex: 1, marginRight: 8 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '500', color: '#2D3748', marginBottom: 8 },
  textInput: { height: 52, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#2D3748' },
  signUpButton: { backgroundColor: '#8B5CF6', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 24 },
  signUpButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
  logInContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  logInText: { fontSize: 16, color: '#4A5568' },
  logInLink: { fontSize: 16, color: '#8B5CF6', fontWeight: '600' },
  errorText: { color: 'red', fontSize: 14, marginBottom: 12, textAlign: 'center' },
});

export default SignUpScreen;
