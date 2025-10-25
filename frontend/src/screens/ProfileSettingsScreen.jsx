// ==================== ProfileSettingsScreen.jsx ====================
import React, {useState} from 'react';
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const ProfileSettingsScreen = ({route}) => {
  const navigation = useNavigation();
  const theme = route?.params?.theme || 'light';
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState({
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    emergencyContact: '+91 98765 00000',
    bloodGroup: 'O+',
  });

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    console.log('Profile saved:', profile);
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

      <View style={[styles.screenHeader, {borderBottomColor: isDark ? '#374151' : '#E5E7EB'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, {color: isDark ? '#F9FAFB' : '#111827'}]}>
          Profile Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            <View style={[styles.profilePicture, {backgroundColor: isDark ? '#4B5563' : '#E5E7EB'}]}>
              <Icon name="person" size={60} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </View>
            <TouchableOpacity style={styles.editPhotoButton}>
              <Icon name="camera-alt" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, {color: isDark ? '#F9FAFB' : '#111827'}]}>
            {profile.name}
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: isDark ? '#D1D5DB' : '#374151'}]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#F9FAFB' : '#111827',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
              value={profile.name}
              onChangeText={(text) => setProfile({...profile, name: text})}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: isDark ? '#D1D5DB' : '#374151'}]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#F9FAFB' : '#111827',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
              value={profile.email}
              onChangeText={(text) => setProfile({...profile, email: text})}
              keyboardType="email-address"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: isDark ? '#D1D5DB' : '#374151'}]}>
              Phone Number
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#F9FAFB' : '#111827',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
              value={profile.phone}
              onChangeText={(text) => setProfile({...profile, phone: text})}
              keyboardType="phone-pad"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: isDark ? '#D1D5DB' : '#374151'}]}>
              Address
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#F9FAFB' : '#111827',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
              value={profile.address}
              onChangeText={(text) => setProfile({...profile, address: text})}
              multiline
              numberOfLines={3}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: isDark ? '#D1D5DB' : '#374151'}]}>
              Blood Group
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#F9FAFB' : '#111827',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
              value={profile.bloodGroup}
              onChangeText={(text) => setProfile({...profile, bloodGroup: text})}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: isDark ? '#D1D5DB' : '#374151'}]}>
              Emergency Contact
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#F9FAFB' : '#111827',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
              value={profile.emergencyContact}
              onChangeText={(text) => setProfile({...profile, emergencyContact: text})}
              keyboardType="phone-pad"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 40,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
  },
  formSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileSettingsScreen;