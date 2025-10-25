import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Animated,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import Footer from '../components/Footer';

// API endpoint for fetching safe places
const API_ENDPOINT = 'https://example.com/api/safe-places';

const MapPage = ({ navigation, route }) => {
  const { theme = 'light' } = route.params || {};
  const [userLocation, setUserLocation] = useState(null);
  const [safePlaces, setSafePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const mapRef = useRef(null);
  const markerAnimations = useRef({});

  // Request location permissions and fetch current location
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Fetch safe places from backend
  useEffect(() => {
    fetchSafePlaces();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        Alert.alert(
          'Permission Denied',
          'Location access is required to show your position on the map.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setLoading(false);

      // Optional: Watch location for live updates
      watchUserLocation();
    } catch (error) {
      console.error('Error requesting location:', error);
      setLocationError('Failed to get location');
      setLoading(false);
    }
  };

  const watchUserLocation = async () => {
    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          setUserLocation((prev) => ({
            ...prev,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }));
        }
      );
    } catch (error) {
      console.error('Error watching location:', error);
    }
  };

  const fetchSafePlaces = async () => {
    try {
      // Replace with actual API call
      const response = await fetch(API_ENDPOINT);
      
      if (!response.ok) {
        throw new Error('Failed to fetch safe places');
      }

      const data = await response.json();
      setSafePlaces(data);

      // Initialize marker animations
      data.forEach((place) => {
        markerAnimations.current[place.id] = new Animated.Value(0);
        Animated.spring(markerAnimations.current[place.id], {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      });
    } catch (error) {
      console.error('Error fetching safe places:', error);
      // Fallback mock data for demonstration
      const mockData = [
        {
          id: 1,
          name: 'Central Police Station',
          type: 'police',
          latitude: 19.0760,
          longitude: 72.8777,
          description: '24/7 police assistance available',
        },
        {
          id: 2,
          name: 'City Hospital',
          type: 'hospital',
          latitude: 19.0896,
          longitude: 72.8656,
          description: 'Emergency medical services',
        },
        {
          id: 3,
          name: 'Women\'s Shelter',
          type: 'shelter',
          latitude: 19.0620,
          longitude: 72.8900,
          description: 'Safe accommodation for women',
        },
        {
          id: 4,
          name: 'North District Police',
          type: 'police',
          latitude: 19.0950,
          longitude: 72.8750,
          description: 'Police station',
        },
        {
          id: 5,
          name: 'Safe Zone Center',
          type: 'shelter',
          latitude: 19.0700,
          longitude: 72.8600,
          description: 'Community safe zone',
        },
        {
          id: 6,
          name: 'Emergency Medical Center',
          type: 'hospital',
          latitude: 19.0800,
          longitude: 72.8700,
          description: 'Emergency services',
        },
      ];
      setSafePlaces(mockData);

      mockData.forEach((place) => {
        markerAnimations.current[place.id] = new Animated.Value(0);
        Animated.spring(markerAnimations.current[place.id], {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const getMarkerColor = (type) => {
    switch (type.toLowerCase()) {
      case 'police':
        return '#EF4444';
      case 'hospital':
        return '#10B981';
      case 'shelter':
        return '#3B82F6';
      default:
        return '#6366F1';
    }
  };

  const getMarkerIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'police':
        return 'shield-check';
      case 'hospital':
        return 'hospital-box';
      case 'shelter':
        return 'home-heart';
      default:
        return 'map-marker';
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula to calculate distance in kilometers
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  const openDirectionsInGoogleMaps = (place) => {
    // Open Google Maps with directions from current location to the safe place
    const url = userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${place.latitude},${place.longitude}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open Google Maps');
        }
      })
      .catch((err) => console.error('Error opening maps:', err));
  };

  const animateToPlace = (place) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
    setSelectedPlace(place.id);
    setTimeout(() => setSelectedPlace(null), 3000);
  };

  const handleShareLocation = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`;
      Linking.openURL(url);
    }
  };

  const renderSafePlaceItem = ({ item }) => {
    const distance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          item.latitude,
          item.longitude
        )
      : null;

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => openDirectionsInGoogleMaps(item)}
        activeOpacity={0.7}
      >
        <View style={styles.listItemContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getMarkerColor(item.type) + '20' },
            ]}
          >
            <Icon name={getMarkerIcon(item.type)} size={24} color={getMarkerColor(item.type)} />
          </View>
          <View style={styles.listItemInfo}>
            <Text style={styles.listItemName}>{item.name}</Text>
            <Text style={styles.listItemType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              {distance && ` • ${distance} km away`}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EF4444" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </SafeAreaView>
    );
  }

  if (locationError && !userLocation) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Header theme={theme} />
        <View style={styles.errorContent}>
          <Icon name="map-marker-off" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Unable to access your location</Text>
          <Text style={styles.errorSubtext}>
            Please enable location services to use this feature
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={requestLocationPermission}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <Footer theme={theme} navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header theme={theme} />

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {userLocation && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={userLocation}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            {/* User Location Marker */}
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerInner} />
              </View>
            </Marker>

            {/* Safe Places Markers */}
            {safePlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.description}
                onPress={() => animateToPlace(place)}
              >
                <View
                  style={[
                    styles.customMarker,
                    { backgroundColor: getMarkerColor(place.type) },
                    selectedPlace === place.id && styles.selectedMarker,
                  ]}
                >
                  <Icon
                    name={getMarkerIcon(place.type)}
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
              </Marker>
            ))}
          </MapView>
        )}

        {/* Share Location Button */}
        <TouchableOpacity 
          style={styles.shareLocationButton}
          onPress={handleShareLocation}
        >
          <Icon name="share-variant" size={16} color="#1F2937" />
          <Text style={styles.shareLocationText}>Share Location</Text>
        </TouchableOpacity>
      </View>

      {/* Safe Places List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <View style={styles.listHeaderLeft}>
            <Icon name="map-marker-check" size={24} color="#059669" />
            <Text style={styles.listTitle}>Safe Places Nearby</Text>
          </View>
          <Text style={styles.listSubtitle}>{safePlaces.length} locations</Text>
        </View>
        
        <FlatList
          data={safePlaces}
          renderItem={renderSafePlaceItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <Footer theme={theme} navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  userMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  customMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedMarker: {
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  shareLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  shareLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  listHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  listSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  listItemType: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    height: 12,
  },
});

export default MapPage;