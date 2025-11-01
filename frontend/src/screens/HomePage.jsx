// src/screens/HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchCurrentLocation, updateUserLocation } from '../api'; // ✅ use both APIs

const HomePage = ({ route, navigation }) => {
  const { theme = 'light' } = route.params || {};
  const isDarkMode = theme === 'dark';

  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  // ✅ Fetch last saved location on load
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
      } else {
        console.log('No previous location found:', data.detail || data);
      }
    })();
  }, []);

  // ✅ Watch and update live location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // every 5 seconds
          distanceInterval: 10, // every 10 meters
        },
        async (loc) => {
          const newLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          setLocation(newLocation);

          // ✅ Send live updates to backend
          try {
            const res = await updateUserLocation(
              loc.coords.latitude,
              loc.coords.longitude
            );
            if (!res.ok) console.log('Error updating location:', res.data);
          } catch (err) {
            console.log('Backend update failed:', err.message);
          }
        }
      );

      return () => subscription && subscription.remove();
    })();
  }, []);

  // Move map to current location
  const handleTrackMe = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(location, 1000);
    }
  };

  // Buttons (placeholders)
  const handleInviteSMS = () => console.log('Invite via SMS pressed');
  const handleSOSCall = () => console.log('SOS Call pressed');
  const handleImSafe = () => console.log("I'm Safe pressed");
  const handleNeedHelp = () => console.log('Need Help pressed');

  const dynamicStyles = {
    ...styles,
    container: {
      ...styles.container,
      backgroundColor: isDarkMode ? '#111827' : '#F3F4F6',
    },
    scrollView: {
      ...styles.scrollView,
      backgroundColor: isDarkMode ? '#111827' : '#F3F4F6',
    },
    card: {
      ...styles.card,
      backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
    },
    cardTitle: {
      ...styles.cardTitle,
      color: isDarkMode ? '#F9FAFB' : '#111827',
    },
    friendName: {
      ...styles.friendName,
      color: isDarkMode ? '#E5E7EB' : '#374151',
    },
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header theme={theme} />

      <ScrollView
        style={dynamicStyles.scrollView}
        contentContainerStyle={[dynamicStyles.scrollViewContent, { paddingTop: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Friends Card */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Add Friends</Text>
          <TouchableOpacity
            style={dynamicStyles.inviteButton}
            onPress={handleInviteSMS}
            activeOpacity={0.8}
          >
            <Text style={dynamicStyles.inviteButtonText}>Invite via SMS</Text>
          </TouchableOpacity>
        </View>

        {/* Current Friends */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Current Friends</Text>
          <View style={dynamicStyles.friendsList}>
            <View style={dynamicStyles.friendItem}>
              <View style={dynamicStyles.friendAvatar} />
              <Text style={dynamicStyles.friendName}>John Smith</Text>
            </View>
            <View style={dynamicStyles.friendItem}>
              <View style={dynamicStyles.friendAvatar} />
              <Text style={dynamicStyles.friendName}>Emma Johnson</Text>
            </View>
          </View>
        </View>

        {/* SOS Call */}
        <TouchableOpacity
          style={dynamicStyles.sosButton}
          onPress={handleSOSCall}
          activeOpacity={0.8}
        >
          <Text style={dynamicStyles.sosButtonText}>SOS Call</Text>
        </TouchableOpacity>

        {/* Emergency Status */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Emergency Status Update</Text>
          <View style={dynamicStyles.emergencyButtonsContainer}>
            <TouchableOpacity
              style={dynamicStyles.safeButton}
              onPress={handleImSafe}
              activeOpacity={0.8}
            >
              <Text style={dynamicStyles.safeButtonText}>I'm Safe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.helpButton}
              onPress={handleNeedHelp}
              activeOpacity={0.8}
            >
              <Text style={dynamicStyles.helpButtonText}>Need Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map (only current location) */}
        {location ? (
          <View style={dynamicStyles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={dynamicStyles.map}
              initialRegion={location}
              showsUserLocation
              showsMyLocationButton
            >
              <Marker coordinate={location} title="You are here" />
            </MapView>
            <TouchableOpacity
              style={dynamicStyles.trackMeButton}
              onPress={handleTrackMe}
              activeOpacity={0.8}
            >
              <Text style={dynamicStyles.trackMeButtonText}>Track Me</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={dynamicStyles.mapLoading}>
            <Text style={dynamicStyles.mapLoadingText}>Loading map...</Text>
          </View>
        )}
      </ScrollView>

      <Footer theme={theme} navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollViewContent: { padding: 16, paddingBottom: 120 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  inviteButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
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
  },
  friendName: { fontSize: 16, fontWeight: '500' },
  sosButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#EF4444',
  },
  sosButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  emergencyButtonsContainer: { flexDirection: 'row', gap: 12 },
  safeButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#10B981',
  },
  safeButtonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  helpButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#EF4444',
  },
  helpButtonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  mapContainer: { height: 200, borderRadius: 12, marginBottom: 16 },
  map: { ...StyleSheet.absoluteFillObject },
  mapLoading: {
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  mapLoadingText: { color: '#6B7280' },
  trackMeButton: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
  },
  trackMeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default HomePage;
