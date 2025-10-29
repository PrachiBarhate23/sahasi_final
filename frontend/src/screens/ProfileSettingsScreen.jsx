import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, updateUserProfile } from '../api';

export const ProfileSettingsScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = route?.params?.theme || 'light';
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in');
          setLoading(false);
          return;
        }

        const res = await getUserProfile(token);
        if (res.ok && res.data) {
          setProfile({
            name: `${res.data.first_name || ''} ${res.data.last_name || ''}`.trim(),
            email: res.data.email || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            emergencyContact: res.data.emergency_contact || '',
            bloodGroup: res.data.blood_group || '',
          });
        } else {
          Alert.alert('Error', res.data?.detail || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Fetch Profile Error:', err);
        Alert.alert('Error', 'Something went wrong while fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile save
 // Handle profile save
const handleSave = async () => {
  setSaving(true);
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'No auth token found');
      setSaving(false);
      return;
    }

    const [first_name, ...last_nameArr] = profile.name.split(' ');
    const last_name = last_nameArr.join(' ');

    const res = await updateUserProfile(token, {
      first_name,
      last_name,
      email: profile.email,
      phone_number: profile.phone,
      address: profile.address,
      emergency_contact: profile.emergencyContact,
      blood_group: profile.bloodGroup,
    });

    if (res.ok && res.data) {
      // ✅ Navigate to ProfileCompletedScreen after successful save
      navigation.replace('ProfileCompletedScreen', {
        name: `${res.data.first_name || ''} ${res.data.last_name || ''}`.trim(),
      });

      // Update AsyncStorage for autofill
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          phoneNumber: res.data.phone_number,
          email: res.data.email,
          username: res.data.username || '',
        })
      );

      setProfile({
        name: `${res.data.first_name || ''} ${res.data.last_name || ''}`.trim(),
        email: res.data.email || '',
        phone: res.data.phone_number || '',
        address: res.data.address || '',
        emergencyContact: res.data.emergency_contact || '',
        bloodGroup: res.data.blood_group || '',
      });
    } else {
      Alert.alert('Error', res.data?.detail || 'Failed to update profile');
    }
  } catch (err) {
    console.error('Update Profile Error:', err);
    Alert.alert('Error', 'Something went wrong while updating profile');
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ marginTop: 8, color: isDark ? '#F9FAFB' : '#111827' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#111827' : '#F3F4F6'} />

      <View style={[styles.screenHeader, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Profile Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            <View style={[styles.profilePicture, { backgroundColor: isDark ? '#4B5563' : '#E5E7EB' }]}>
              <Icon name="person" size={60} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </View>
            <TouchableOpacity style={styles.editPhotoButton}>
              <Icon name="camera-alt" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: isDark ? '#F9FAFB' : '#111827' }]}>{profile.name}</Text>
        </View>

        <View style={styles.formSection}>
          {[
            { label: 'Full Name', key: 'name', keyboardType: 'default' },
            { label: 'Email', key: 'email', keyboardType: 'email-address' },
            { label: 'Phone Number', key: 'phone', keyboardType: 'phone-pad' },
            { label: 'Address', key: 'address', keyboardType: 'default', multiline: true },
            { label: 'Blood Group', key: 'bloodGroup', keyboardType: 'default' },
            { label: 'Emergency Contact', key: 'emergencyContact', keyboardType: 'phone-pad' },
          ].map((field) => (
            <View style={styles.inputGroup} key={field.key}>
              <Text style={[styles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>{field.label}</Text>
              <TextInput
                style={[
                  styles.input,
                  field.multiline ? styles.textArea : {},
                  {
                    backgroundColor: isDark ? '#374151' : '#FFFFFF',
                    color: isDark ? '#F9FAFB' : '#111827',
                    borderColor: isDark ? '#4B5563' : '#E5E7EB',
                  },
                ]}
                value={profile[field.key] || ''}
                onChangeText={(text) => setProfile({ ...profile, [field.key]: text })}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                keyboardType={field.keyboardType}
                multiline={field.multiline || false}
                numberOfLines={field.multiline ? 3 : 1}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { paddingBottom: 40 },
  screenHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  screenTitle: { fontSize: 18, fontWeight: '700' },
  placeholder: { width: 40 },
  profilePictureSection: { alignItems: 'center', paddingVertical: 24 },
  profilePictureContainer: { position: 'relative', marginBottom: 16 },
  profilePicture: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  editPhotoButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3B82F6', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 22, fontWeight: '700' },
  formSection: { paddingHorizontal: 16, marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#22C55E', borderRadius: 8, paddingVertical: 14, marginHorizontal: 16, alignItems: 'center', marginTop: 8, marginBottom: 24 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default ProfileSettingsScreen;
