import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header'; // ✅ import header
import { sharedStyles } from '../screens/sharedStyles'; // adjust path as needed

export const FakeCallSetupScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = route?.params?.theme || 'light';
  const isDark = theme === 'dark';

  const [callSettings, setCallSettings] = useState({
    callerName: 'Mom',
    callerNumber: '+91 98765 12345',
    ringtone: 'Default',
    delaySeconds: 5,
    enableVibration: true,
    autoAnswer: false,
  });

  const handleTestCall = () => {
    Alert.alert('Test Call', `Fake call will start in ${callSettings.delaySeconds} seconds`);
    console.log('Testing fake call with settings:', callSettings);
  };

  return (
    <SafeAreaView
      style={[
        sharedStyles.safeArea,
        { backgroundColor: isDark ? '#111827' : '#F3F4F6' },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#F3F4F6'}
      />

      {/* ✅ Floating Header */}
      {/* <Header theme={theme} /> */}

      <ScrollView
        style={sharedStyles.scrollView}
        contentContainerStyle={[
          sharedStyles.contentContainer,
          // { paddingTop: 120 }, // ✅ space for header
        ]}
      >
        {/* Back + Title Section */}
        <View
          style={[
            sharedStyles.screenHeader,
            { borderBottomColor: isDark ? '#374151' : '#E5E7EB' },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={sharedStyles.backButton}>
            <Icon name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          <Text style={[sharedStyles.screenTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
            Fake Call Setup
          </Text>
          <View style={sharedStyles.placeholder} />
        </View>

        {/* Info Section */}
        <View style={[sharedStyles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#EFF6FF' }]}>
          <Icon name="info" size={24} color="#3B82F6" />
          <Text style={[sharedStyles.infoText, { color: isDark ? '#93C5FD' : '#1E40AF' }]}>
            Configure a fake incoming call to help you exit uncomfortable situations safely.
          </Text>
        </View>

        {/* Caller Details */}
        <View style={sharedStyles.formSection}>
          <Text style={[sharedStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
            Caller Details
          </Text>

          {[
            { label: 'Caller Name', key: 'callerName', keyboardType: 'default' },
            { label: 'Caller Number', key: 'callerNumber', keyboardType: 'phone-pad' },
          ].map((field, i) => (
            <View style={sharedStyles.inputGroup} key={i}>
              <Text style={[sharedStyles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                {field.label}
              </Text>
              <TextInput
                style={[
                  sharedStyles.input,
                  {
                    backgroundColor: isDark ? '#374151' : '#FFFFFF',
                    color: isDark ? '#F9FAFB' : '#111827',
                    borderColor: isDark ? '#4B5563' : '#E5E7EB',
                  },
                ]}
                value={callSettings[field.key]}
                onChangeText={(text) => setCallSettings({ ...callSettings, [field.key]: text })}
                keyboardType={field.keyboardType}
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              />
            </View>
          ))}

          {/* Ringtone and Delay */}
          <View style={sharedStyles.inputGroup}>
            <Text style={[sharedStyles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
              Ringtone
            </Text>
            <TouchableOpacity
              style={[
                sharedStyles.input,
                sharedStyles.selectInput,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
            >
              <Text style={[sharedStyles.selectText, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                {callSettings.ringtone}
              </Text>
              <Icon name="chevron-right" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          <View style={sharedStyles.inputGroup}>
            <Text style={[sharedStyles.label, { color: isDark ? '#D1D5DB' : '#374151' }]}>
              Delay (seconds)
            </Text>
            <TextInput
              style={[
                sharedStyles.input,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  color: isDark ? '#F9FAFB' : '#111827',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
              value={callSettings.delaySeconds.toString()}
              onChangeText={(text) =>
                setCallSettings({ ...callSettings, delaySeconds: parseInt(text) || 0 })
              }
              keyboardType="numeric"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>
        </View>

        {/* Toggles */}
        <View style={sharedStyles.formSection}>
          <Text style={[sharedStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
            Call Settings
          </Text>

          {[
            {
              icon: 'vibration',
              title: 'Enable Vibration',
              description: 'Vibrate on incoming call',
              value: callSettings.enableVibration,
              setter: (val) => setCallSettings({ ...callSettings, enableVibration: val }),
            },
            {
              icon: 'phone-forwarded',
              title: 'Auto Answer',
              description: 'Automatically answer the call',
              value: callSettings.autoAnswer,
              setter: (val) => setCallSettings({ ...callSettings, autoAnswer: val }),
            },
          ].map((toggle, i) => (
            <View
              key={i}
              style={[
                sharedStyles.toggleRow,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  borderColor: isDark ? '#4B5563' : '#E5E7EB',
                },
              ]}
            >
              <View style={sharedStyles.toggleLeft}>
                <Icon name={toggle.icon} size={24} color={isDark ? '#F9FAFB' : '#111827'} />
                <View style={sharedStyles.toggleTextContainer}>
                  <Text style={[sharedStyles.toggleTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                    {toggle.title}
                  </Text>
                  <Text style={[sharedStyles.toggleDescription, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
                    {toggle.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={toggle.value}
                onValueChange={toggle.setter}
                trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                thumbColor={toggle.value ? '#22C55E' : '#F3F4F6'}
              />
            </View>
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={sharedStyles.testButton} onPress={handleTestCall}>
          <Icon name="play-arrow" size={24} color="#FFFFFF" />
          <Text style={sharedStyles.testButtonText}>Test Fake Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={sharedStyles.saveButton}
          onPress={() => Alert.alert('Success', 'Settings saved!')}
        >
          <Text style={sharedStyles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FakeCallSetupScreen;
