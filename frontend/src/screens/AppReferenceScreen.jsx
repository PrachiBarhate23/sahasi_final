// ==================== AppReferenceScreen.jsx ====================
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sharedStyles } from '../screens/sharedStyles'; // adjust path as needed

export const AppReferenceScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = route?.params?.theme || 'light';
  const isDark = theme === 'dark';

  const features = [
    { icon: 'warning', title: 'SOS Alert', description: 'Press and hold the SOS button for 3 seconds to send emergency alerts to your trusted contacts with your live location.', color: '#EF4444' },
    { icon: 'phone-in-talk', title: 'Fake Call', description: 'Simulate incoming calls to help you exit uncomfortable situations. Configure caller details in settings.', color: '#3B82F6' },
    { icon: 'contacts', title: 'Trusted Contacts', description: 'Add up to 5 trusted contacts who will receive your emergency alerts and location updates.', color: '#22C55E' },
    { icon: 'location-on', title: 'Location Sharing', description: 'Share your real-time location with trusted contacts. Location is automatically shared during SOS alerts.', color: '#8B5CF6' },
    { icon: 'mic', title: 'Audio Recording', description: 'Emergency audio recording starts automatically during SOS mode and is sent to your contacts.', color: '#F59E0B' },
    { icon: 'shield', title: 'Safe Journey', description: 'Start a safe journey timer that alerts contacts if you don\'t mark yourself as safe within the set time.', color: '#06B6D4' },
  ];

  const emergencyNumbers = [
    { title: 'National Emergency', number: '112', description: 'All emergency services' },
    { title: 'Women Helpline', number: '1091', description: '24x7 women in distress' },
    { title: 'Police', number: '100', description: 'Law enforcement' },
    { title: 'Ambulance', number: '102', description: 'Medical emergency' },
  ];

  return (
    <SafeAreaView style={[sharedStyles.safeArea, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#111827' : '#F3F4F6'} />

      <View style={[sharedStyles.screenHeader, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={sharedStyles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        <Text style={[sharedStyles.screenTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
          App Reference
        </Text>
        <View style={sharedStyles.placeholder} />
      </View>

      <ScrollView style={sharedStyles.scrollView} contentContainerStyle={sharedStyles.contentContainer}>
        <View style={sharedStyles.welcomeSection}>
          <View style={[sharedStyles.logoContainer, { backgroundColor: isDark ? '#374151' : '#FEE2E2' }]}>
            <Icon name="shield" size={48} color="#DC2626" />
          </View>
          <Text style={[sharedStyles.appTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Welcome to Sahasi</Text>
          <Text style={[sharedStyles.appSubtitle, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
            Your personal safety companion. Learn how to use all features effectively.
          </Text>
        </View>

        <View style={sharedStyles.featuresSection}>
          <Text style={[sharedStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Features Guide</Text>
          {features.map((feature, index) => (
            <View key={index} style={[sharedStyles.featureCard, { backgroundColor: isDark ? '#374151' : '#FFFFFF', shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 }]}>
              <View style={[sharedStyles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <Icon name={feature.icon} size={28} color={feature.color} />
              </View>
              <View style={sharedStyles.featureContent}>
                <Text style={[sharedStyles.featureTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>{feature.title}</Text>
                <Text style={[sharedStyles.featureDescription, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={sharedStyles.emergencySection}>
          <Text style={[sharedStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Emergency Numbers</Text>
          <View style={[sharedStyles.infoCard, { backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2' }]}>
            <Icon name="phone" size={24} color="#DC2626" />
            <Text style={[sharedStyles.infoText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
              Save these numbers. In emergency, every second counts.
            </Text>
          </View>

          {emergencyNumbers.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[sharedStyles.emergencyCard, { backgroundColor: isDark ? '#374151' : '#FFFFFF', borderColor: isDark ? '#4B5563' : '#E5E7EB' }]}
              onPress={() => {
                Alert.alert('Call ' + item.title, 'Do you want to call ' + item.number + '?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Call', onPress: () => console.log('Calling ' + item.number) },
                ]);
              }}
            >
              <View style={sharedStyles.emergencyLeft}>
                <View style={sharedStyles.emergencyNumberBadge}>
                  <Text style={sharedStyles.emergencyNumber}>{item.number}</Text>
                </View>
                <View style={sharedStyles.emergencyInfo}>
                  <Text style={[sharedStyles.emergencyTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>{item.title}</Text>
                  <Text style={[sharedStyles.emergencyDescription, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{item.description}</Text>
                </View>
              </View>
              <Icon name="phone" size={24} color="#22C55E" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Tips */}
        <View style={sharedStyles.tipsSection}>
          <Text style={[sharedStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Safety Tips</Text>
          <View style={[sharedStyles.tipCard, { backgroundColor: isDark ? '#374151' : '#FFFFFF', shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 }]}>
            <View style={sharedStyles.tipHeader}>
              <Icon name="lightbulb" size={24} color="#F59E0B" />
              <Text style={[sharedStyles.tipTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Best Practices</Text>
            </View>
            <View style={sharedStyles.tipsList}>
              {[
                'Always keep your phone charged and location services enabled',
                'Test the SOS feature regularly with your trusted contacts',
                'Update your emergency contacts periodically',
                'Share your journey details when traveling alone',
                'Trust your instincts - if something feels wrong, activate SOS',
                'Keep emergency numbers saved in your phone contacts',
              ].map((tip, index) => (
                <View key={index} style={sharedStyles.tipItem}>
                  <Icon name="check-circle" size={20} color="#22C55E" />
                  <Text style={[sharedStyles.tipText, { color: isDark ? '#D1D5DB' : '#374151' }]}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Support */}
        <View style={sharedStyles.supportSection}>
          <Text style={[sharedStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Need Help?</Text>
          <TouchableOpacity style={[sharedStyles.supportCard, { backgroundColor: isDark ? '#374151' : '#FFFFFF', borderColor: isDark ? '#4B5563' : '#E5E7EB' }]} onPress={() => Alert.alert('Support', 'Contact us at support@sahasi.app')}>
            <Icon name="support-agent" size={32} color="#3B82F6" />
            <View style={sharedStyles.supportInfo}>
              <Text style={[sharedStyles.supportTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Contact Support</Text>
              <Text style={[sharedStyles.supportDescription, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>Get help with app features and report issues</Text>
            </View>
            <Icon name="chevron-right" size={24} color={isDark ? '#9CA3AF' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>

        <View style={sharedStyles.versionSection}>
          <Text style={[sharedStyles.versionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Sahasi v1.0.0</Text>
          <Text style={[sharedStyles.versionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Made with ❤️ for women's safety</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppReferenceScreen;
