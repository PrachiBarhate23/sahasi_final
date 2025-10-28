import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon URLs for web
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.5/dist/images/marker-shadow.png',
});

// Optional: create colored icons for safe places
const createColoredIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.5/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const MapViewWeb = ({
  userLocation = { latitude: 19.076, longitude: 72.877 }, // Default to Mumbai
  safePlaces = [], // Default empty array
  selectedPlace,
  animateToPlace = () => {}, // Default no-op function
}) => {
  const center = [
    userLocation?.latitude ?? 19.076,
    userLocation?.longitude ?? 72.877,
  ];

  return (
    <View style={styles.mapContainer}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {userLocation?.latitude && userLocation?.longitude && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {Array.isArray(safePlaces) &&
          safePlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={createColoredIcon(
                place.type === 'police'
                  ? 'red'
                  : place.type === 'hospital'
                  ? 'green'
                  : 'blue'
              )}
              eventHandlers={{
                click: () => animateToPlace(place),
              }}
            >
              <Popup>{place.name}</Popup>
            </Marker>
          ))}
      </MapContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default MapViewWeb;
