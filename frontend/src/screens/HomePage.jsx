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
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header'; 
import Footer from '../components/Footer';
import { fetchCurrentLocation, updateUserLocation } from '../api';

const DAILY_MESSAGES = [
  "You are strong and capable! Have a safe day ahead.",
  "Trust your instincts. We're here for you 24/7.",
  "Your safety is our top priority. Stay aware and be well.",
  "Remember to check in with a trusted contact today!",
  "Confidence is your best shield. Go out and shine!",
];

const TRUSTED_CONTACTS = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Emma Johnson' },
    { id: 3, name: 'Michael Lee' },
    { id: 4, name: 'Sarah Chen' },
];

const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    const firstNameInitial = nameParts[0][0];
    const lastNameInitial = nameParts[nameParts.length - 1][0];
    return `${firstNameInitial} ${lastNameInitial}`.toUpperCase();
};

const HomePage = ({ navigation }) => { 
  const { height } = useWindowDimensions(); 
  const [location, setLocation] = useState(null);
  const [dailyMessage, setDailyMessage] = useState(''); 
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
          const newLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          setLocation(newLocation);
          try {
            await updateUserLocation(loc.coords.latitude, loc.coords.longitude);
          } catch (err) { console.log(err); }
        }
      );

      return () => subscription && subscription.remove();
    })();
  }, []);

  const handleInviteSMS = () => console.log('invite');
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >

        {dailyMessage ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{dailyMessage} 💖</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Friends</Text>
          <TouchableOpacity style={styles.inviteButton} onPress={handleInviteSMS}>
            <Text style={styles.inviteButtonText}>Invite via SMS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trusted Contacts</Text>
          <View style={styles.friendsList}>
            {TRUSTED_CONTACTS.map(contact => (
                <View key={contact.id} style={styles.friendItem}>
                    <View style={styles.friendAvatar}>
                        <Text style={styles.avatarText}>
                            {getInitials(contact.name)}
                        </Text>
                    </View>
                    <Text style={styles.friendName}>{contact.name}</Text>
                </View>
            ))}
          </View>
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
              initialRegion={location}
              showsUserLocation
              showsMyLocationButton
            >
              <Marker coordinate={location} title="You are here" />
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
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#111827' },
  inviteButton: { borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', backgroundColor: '#8B5CF6' },
  inviteButtonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  friendsList: { gap: 12 },
  friendItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  friendAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  friendName: { fontSize: 16, fontWeight: '500', color: '#374151' },

  sosButton: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 16, backgroundColor: '#EF4444' },
  sosButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },

  mapContainer: { borderRadius: 12, marginBottom: 16, overflow: 'hidden' }, 
  map: { ...StyleSheet.absoluteFillObject },
  mapLoading: { borderRadius: 12, marginBottom: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB' },
  mapLoadingText: { color: '#6B7280' },
});

export default HomePage;
