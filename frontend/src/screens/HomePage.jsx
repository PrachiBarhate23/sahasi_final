import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MapViewWeb from '../components/MapViewWeb'; // Web-only map
import * as Location from 'expo-location';

const HomePage = ({ navigation, route }) => {
  const { theme = 'light' } = route.params || {};
  const isDarkMode = theme === 'dark';
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        });
      } else {
        // Fallback: try Expo Location API
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    })();
  }, []);

  const handleTrackMe = () => console.log('Track Me');
  const handleSOSCall = () => navigation.navigate('PanicMode');

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <Header theme={theme} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Friends</Text>
          <TouchableOpacity style={styles.inviteButton} activeOpacity={0.8}>
            <Text style={styles.inviteButtonText}>Invite via SMS</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={handleSOSCall}
          activeOpacity={0.8}
        >
          <Text style={styles.sosButtonText}>SOS Call</Text>
        </TouchableOpacity>

        {location ? (
          <MapViewWeb location={location} onTrack={handleTrackMe} />
        ) : (
          <View style={styles.mapLoading}>
            <Text style={styles.mapLoadingText}>Loading map...</Text>
          </View>
        )}
      </ScrollView>

      <Footer theme={theme} navigation={navigation} />
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#111827' : '#F3F4F6' },
    scrollView: { flex: 1 },
    scrollViewContent: { padding: 16, paddingBottom: 100 },
    card: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: isDarkMode ? '#F9FAFB' : '#111827',
    },
    inviteButton: {
      borderRadius: 8,
      paddingVertical: 12,
      backgroundColor: '#8B5CF6',
      alignItems: 'center',
    },
    inviteButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    sosButton: {
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 16,
      backgroundColor: '#EF4444',
    },
    sosButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    mapLoading: {
      height: 300,
      borderRadius: 12,
      marginBottom: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#4B5563' : '#E5E7EB',
    },
    mapLoadingText: { color: isDarkMode ? '#D1D5DB' : '#6B7280' },
  });

export default HomePage;
