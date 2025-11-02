// ==================== AppReferenceScreen.jsx ====================
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  StyleSheet,
  Vibration,
  Image, // <--- Import Image component
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sharedStyles } from '../screens/sharedStyles'; // adjust path as needed

// Import your image asset
import LoadingPic from '../../assets/loading_pic.png'; // <--- Adjust path as needed

// Component for the full-screen simulated call UI (kept unchanged for brevity)
const SimulatedCallScreen = ({ number, title, onEndCall }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState('Ringing...');

  React.useEffect(() => {
    const VIBRATION_PATTERN = [500, 1000];
    Vibration.vibrate(VIBRATION_PATTERN, true);

    const disconnectTimer = setTimeout(() => {
      setStatus('Call Ended');
      Vibration.cancel();
      setElapsedTime(0);

      setTimeout(onEndCall, 1500);
    }, 15000);

    return () => {
      Vibration.cancel();
      clearTimeout(disconnectTimer);
    };
  }, []);

  React.useEffect(() => {
    if (status === 'Ringing...') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const displayTime = status === 'Ringing...' ? formatTime(elapsedTime) : status;

  return (
    <View style={localStyles.callContainer}>
      <StatusBar hidden={true} />
      <View style={localStyles.callInfo}>
        <Text style={localStyles.callStatus}>{status}</Text>
        <Text style={localStyles.callerName}>{title}</Text>
        <Text style={localStyles.callerNumber}>{number}</Text>
        <Text style={localStyles.callTimer}>{displayTime}</Text>
      </View>

      <View style={localStyles.actionButtons}>
        <TouchableOpacity style={[localStyles.actionButton, localStyles.blueBg]} disabled={true}>
          <Icon name="call" size={30} color="#FFF" />
          <Text style={localStyles.actionButtonText}>Answer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[localStyles.actionButton, localStyles.redBg]} onPress={() => { Vibration.cancel(); onEndCall(); }}>
          <Icon name="call-end" size={30} color="#FFF" />
          <Text style={localStyles.actionButtonText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export const AppReferenceScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = route?.params?.theme || 'light';
  const isDark = theme === 'dark';

  const [callActive, setCallActive] = useState(false);
  const [currentCall, setCurrentCall] = useState({ number: '', title: '' });

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

  const handleCallSimulation = (item) => {
    Alert.alert('Simulated Call', 'Do you want to start a simulated call to ' + item.number + '?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start Call', onPress: () => {
          setCurrentCall(item);
          setCallActive(true);
      }},
    ]);
  };

  if (callActive) {
    return (
      <SimulatedCallScreen
        number={currentCall.number}
        title={currentCall.title}
        onEndCall={() => setCallActive(false)}
      />
    );
  }


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
          <View style={[sharedStyles.logoContainer, { backgroundColor: isDark ? '#374151' : '#ffd7d7ff' }]}>
            {/* Replace Icon with Image */}
            <Image
              source={LoadingPic} // <--- Use your imported image
              style={{ width: 90, height: 90 }} // <--- Set width and height to match the Icon size
            />
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
              onPress={() => handleCallSimulation(item)}
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
              <Icon name="phone" size={24} color="#EF4444" />
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
                <View key={index} style={localStyles.responsiveTipItem}>
                  <Icon name="check-circle" size={20} color="#22C55E" style={{marginRight: 8}} />
                  {/* 🟢 FIXED: Wrapped text string in <Text> component */}
                  <Text style={[sharedStyles.tipText, { color: isDark ? '#D1D5DB' : '#374151', flex: 1 }]}>{tip}</Text>
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
          {/* 🟢 FIXED: Wrapped text strings in <Text> component */}
          <Text style={[sharedStyles.versionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Sahasi v1.0.0</Text>
          <Text style={[sharedStyles.versionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Made with ❤️ for women's safety</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


// 🟢 NEW: Local styles for the SimulatedCallScreen component AND responsive fixes
const localStyles = StyleSheet.create({
  callContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 50,
  },
  callInfo: {
    alignItems: 'center',
  },
  callStatus: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 10,
  },
  callerName: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 5,
  },
  callerNumber: {
    color: '#CCC',
    fontSize: 24,
    fontWeight: '300',
  },
  callTimer: {
    color: '#22C55E',
    fontSize: 18,
    marginTop: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  redBg: {
    backgroundColor: '#EF4444',
  },
  blueBg: {
    backgroundColor: '#3B82F6',
    opacity: 0.5,
  },
  // 🟢 NEW: Responsive style for tip items
  responsiveTipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Important for multi-line text alignment
    marginBottom: 8,
    // Add horizontal padding if sharedStyles.tipsList doesn't have it
    paddingRight: 16,
  }
});


export default AppReferenceScreen;