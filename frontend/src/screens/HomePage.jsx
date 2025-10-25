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

// IMPORTANT FIX: Ensure 'navigation' is received as a prop from React Navigation
const HomePage = ({ navigation, route }) => {
  const { theme = 'light' } = route.params || {};
  const isDarkMode = theme === 'dark';

  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      );
      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    })();
  }, []);

  // --- NAVIGATION FUNCTION FOR MAP BUTTON ---
  const handleMapNavigation = () => {
    // This function is passed to the Footer as 'onNavigate'
    if (navigation) {
      navigation.navigate('MapPage'); // Ensure 'MapPage' is registered in App.jsx
    } else {
      console.error("Navigation object is undefined in HomePage.");
    }
  };
  // ------------------------------------------

  const handleInviteSMS = () => {
    console.log('Invite via SMS pressed');
  };

  const handleSOSCall = () => {
    navigation.navigate('PanicMode');
  };

  const handleImSafe = () => {
    console.log("I'm Safe pressed");
  };

  const handleNeedHelp = () => {
    console.log('Need Help pressed');
  };

  const handleShareLocation = () => {
    console.log('Share Location pressed');
  };
  
  const handleTrackMe = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(location, 1000);
    }
  };

  const getStyles = () => ({
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
      shadowColor: isDarkMode ? '#000000' : '#000000',
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
    },
    cardTitle: {
      ...styles.cardTitle,
      color: isDarkMode ? '#F9FAFB' : '#111827',
    },
    friendName: {
      ...styles.friendName,
      color: isDarkMode ? '#E5E7EB' : '#374151',
    },
    inviteButton: {
      ...styles.inviteButton,
      backgroundColor: '#8B5CF6',
    },
    inviteButtonText: {
      ...styles.inviteButtonText,
      color: '#FFFFFF',
    },
    sosButton: {
      ...styles.sosButton,
      backgroundColor: '#EF4444',
    },
    sosButtonText: {
      ...styles.sosButtonText,
      color: '#FFFFFF',
    },
    emergencyButtonsContainer: {
      ...styles.emergencyButtonsContainer,
    },
    safeButton: {
      ...styles.safeButton,
      backgroundColor: '#10B981',
    },
    safeButtonText: {
      ...styles.safeButtonText,
      color: '#FFFFFF',
    },
    helpButton: {
      ...styles.helpButton,
      backgroundColor: '#EF4444',
    },
    helpButtonText: {
      ...styles.helpButtonText,
      color: '#FFFFFF',
    },
    mapContainer: {
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    mapLoading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#4B5563' : '#E5E7EB',
    },
    mapLoadingText: {
      color: isDarkMode ? '#D1D5DB' : '#6B7280',
    },
    trackMeButton: {
      position: 'absolute',
      bottom: 12,
      alignSelf: 'center',
      backgroundColor: '#8B5CF6',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    trackMeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const dynamicStyles = getStyles();

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header theme={theme} />
      
      <ScrollView 
        style={dynamicStyles.scrollView}
        contentContainerStyle={dynamicStyles.scrollViewContent}
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

        {/* Current Friends Card */}
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

        {/* SOS Call Button */}
        <TouchableOpacity 
          style={dynamicStyles.sosButton}
          onPress={handleSOSCall}
          activeOpacity={0.8}
        >
          <Text style={dynamicStyles.sosButtonText}>SOS Call</Text>
        </TouchableOpacity>

        {/* Emergency Status Update Card */}
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

        {/* Live Map View */}
        {location ? (
          <View style={dynamicStyles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={dynamicStyles.map}
              initialRegion={location}
              showsUserLocation={true}
              showsMyLocationButton={true} // Set this to true to show the default button
              loadingEnabled={true}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="You are here"
              />
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

      {/* PASS THE NAVIGATION FUNCTION TO THE FOOTER */}
      <Footer 
        theme={theme} 
        navigation={navigation} // <-- THIS IS THE CRITICAL LINE
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  inviteButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  friendsList: {
    gap: 12,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
  },
  sosButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sosButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  emergencyButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  safeButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  safeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  helpButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapLoading: {
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  mapLoadingText: {
    color: '#6B7280',
  },
  trackMeButton: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackMeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomePage;
