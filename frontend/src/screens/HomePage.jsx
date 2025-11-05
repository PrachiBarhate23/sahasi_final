// src/screens/HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Speech from "expo-speech";


import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  fetchCurrentLocation,
  updateUserLocation,
  getTrustedContacts,
  getSafetyScore,
} from '../api';

const DAILY_MESSAGES = [
  "You are strong and capable! Have a safe day ahead.",
  "Trust your instincts. We're here for you 24/7.",
  "Your safety is our top priority. Stay aware and be well.",
  "Remember to check in with a trusted contact today!",
  "Confidence is your best shield. Go out and shine!",
];

const getInitials = (name) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
  return `${nameParts[0][0]} ${nameParts[nameParts.length - 1][0]}`.toUpperCase();
};

const HomePage = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [location, setLocation] = useState(null);
  const [dailyMessage, setDailyMessage] = useState('');
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const [safetyScore, setSafetyScore] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { ok, data } = await fetchCurrentLocation();
      if (ok && data.latitude && data.longitude) {
        setLocation({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    })();
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * DAILY_MESSAGES.length);
    setDailyMessage(DAILY_MESSAGES[randomIndex]);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (loc) => {
          setLocation((prev) => ({
  ...prev,
  latitude: loc.coords.latitude,
  longitude: loc.coords.longitude,
}));

mapRef.current?.animateToRegion({
  latitude: loc.coords.latitude,
  longitude: loc.coords.longitude,
  latitudeDelta: location?.latitudeDelta ?? 0.005,
  longitudeDelta: location?.longitudeDelta ?? 0.005,
}, 800);


          await updateUserLocation(loc.coords.latitude, loc.coords.longitude);

          const res = await getSafetyScore(loc.coords.latitude, loc.coords.longitude);
          if (res.ok) {
            setSafetyScore(res.data.score);
            setRiskLevel(res.data.risk_level);

            if (res.data.risk_level === "Caution") {
              Speech.speak("Be alert. This area may be moderately risky.");
            }
            if (res.data.risk_level === "Unsafe") {
  Speech.speak("Warning. Unsafe area detected. Move to a safer location.");
}

          }
        }
      );

      return () => subscription && subscription.remove();
    })();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoadingContacts(true);
      const res = await getTrustedContacts();
      if (res.ok && res.data) setTrustedContacts(res.data);
      else Alert.alert('Error', 'Failed to fetch trusted contacts');
      setLoadingContacts(false);
    };
    fetchContacts();
  }, []);

  const handleInviteSMS = () => console.log('Invite via SMS');
  const handleSOSCall = () => navigation.navigate('PanicMode');

  const responsiveMapHeight = height * 0.25;
  const responsiveStyles = {
    ...styles,
    mapContainer: { ...styles.mapContainer, height: responsiveMapHeight },
    mapLoading: { ...styles.mapLoading, height: responsiveMapHeight },
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

        {dailyMessage && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{dailyMessage} 💖</Text>
          </View>
        )}

        {safetyScore !== null && (
          <View style={{
            backgroundColor: "#FFF",
            padding: 14,
            borderRadius: 10,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor:
              riskLevel === "Safe"
                ? "#16A34A"
                : riskLevel === "Caution"
                ? "#2563EB"
                : "#DC2626",
          }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Safety Score: {safetyScore}
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: "600",
              color:
                riskLevel === "Safe"
                  ? "#16A34A"
                  : riskLevel === "Caution"
                  ? "#2563EB"
                  : "#DC2626"
            }}>
              {riskLevel}
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Friends</Text>
          <TouchableOpacity style={styles.inviteButton} onPress={handleInviteSMS}>
            <Text style={styles.inviteButtonText}>Invite via SMS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trusted Contacts</Text>

          {loadingContacts ? (
            <ActivityIndicator size="small" color="#8B5CF6" style={{ marginVertical: 8 }} />
          ) : trustedContacts.length > 0 ? (
            <View style={styles.friendsList}>
              {trustedContacts.map((contact) => (
                <View key={contact.id} style={styles.friendItem}>
                  <View style={styles.friendAvatar}>
                    <Text style={styles.avatarText}>{getInitials(contact.name)}</Text>
                  </View>
                  <View>
                    <Text style={styles.friendName}>{contact.name}</Text>
                    <Text style={{ color: '#6B7280', fontSize: 12 }}>
                      {contact.relation || contact.phone || 'No details'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#6B7280', textAlign: 'center', marginVertical: 8 }}>
              No trusted contacts added yet
            </Text>
          )}

          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => navigation.navigate('TrustedContacts')}
          >
            <Text style={{ color: '#5B21B6', fontWeight: '600' }}>Manage Contacts</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOSCall}>
          <Text style={styles.sosButtonText}>SOS Call</Text>
        </TouchableOpacity>

        {location ? (
          <View style={responsiveStyles.mapContainer}>
           <MapView
  ref={mapRef}
  provider={PROVIDER_GOOGLE}
  style={styles.map}
  initialRegion={location}   // ✅ allow user zoom (DO NOT CONTROL REGION)
  showsUserLocation
  showsMyLocationButton
  zoomEnabled={true}
  scrollEnabled={true}
  pitchEnabled={true}
  rotateEnabled={true}
>


              <Marker coordinate={location} title="You are here" />

              {safetyScore !== null && (
                <Circle
                  center={location}
                  radius={150}
                  fillColor={
                    riskLevel === "Safe"
                      ? "rgba(22,163,74,0.25)"
                      : riskLevel === "Caution"
                      ? "rgba(37,99,235,0.25)"
                      : "rgba(220,38,38,0.25)"
                  }
                  strokeColor={
                    riskLevel === "Safe"
                      ? "rgba(22,163,74,0.6)"
                      : riskLevel === "Caution"
                      ? "rgba(37,99,235,0.6)"
                      : "rgba(220,38,38,0.6)"
                  }
                  strokeWidth={2}
                />
              )}
            </MapView>
          </View>
        ) : (
          <View style={responsiveStyles.mapLoading}>
            <Text style={styles.mapLoadingText}>Loading map...</Text>
          </View>
        )}
      </ScrollView>

      <Footer navigation={navigation} theme="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollView: { flex: 1 },
  scrollViewContent: { padding: 16, paddingBottom: 140, paddingTop: 120 },
  messageBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#EAE3FF',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    marginBottom: 16,
    marginTop: -10,
  },
  messageText: { fontSize: 14, fontWeight: '500', color: '#5B21B6', fontStyle: 'italic' },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#111827' },
  inviteButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
  },
  inviteButtonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  friendsList: { gap: 12 },
  friendItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  friendName: { fontSize: 16, fontWeight: '500', color: '#374151' },
  manageButton: {
    marginTop: 12,
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sosButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#EF4444',
  },
  sosButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  mapContainer: { borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  map: { ...StyleSheet.absoluteFillObject },
  mapLoading: {
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  mapLoadingText: { color: '#6B7280' },
});

export default HomePage;
