import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getSafePlaces } from "../api";

// Fix default icon URLs for web
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-shadow.png",
});

// Colored icons by category
const createColoredIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

const FlyToPlace = ({ position }) => {
  const map = useMap();
  if (position) map.flyTo(position, 15);
  return null;
};

const MapViewWeb = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [safePlaces, setSafePlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [dropdowns, setDropdowns] = useState({});

  // Get user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => console.error("Location error:", err)
    );
  }, []);

  // Fetch safe places from backend
  useEffect(() => {
    if (!userLocation) return;

    const fetchPlaces = async () => {
      try {
        const res = await getSafePlaces(userLocation.latitude, userLocation.longitude);

        if (res.ok && Array.isArray(res.data)) {
          // ✅ Filter only within 2 km
          const filtered = res.data.filter((p) => p.distance_meters <= 2000);

          // ✅ Prioritize police stations first
          const sorted = filtered.sort((a, b) => {
            if (a.category === "police" && b.category !== "police") return -1;
            if (b.category === "police" && a.category !== "police") return 1;
            return a.distance_meters - b.distance_meters;
          });

          setSafePlaces(sorted);

          // Initialize dropdowns
          const categories = [...new Set(sorted.map((p) => p.category))];
          const initState = {};
          categories.forEach((cat) => (initState[cat] = false));
          setDropdowns(initState);
        }
      } catch (err) {
        console.error("Error fetching safe places:", err);
      }
    };

    fetchPlaces();
  }, [userLocation]);

  if (!userLocation) return <Text>Detecting location...</Text>;

  // Group places by category
  const grouped = safePlaces.reduce((acc, place) => {
    const cat = place.category || "unknown";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(place);
    return acc;
  }, {});

  const toggleDropdown = (cat) => {
    setDropdowns((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const renderPlace = ({ item }) => (
    <View style={styles.placeCard}>
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.detailText}>📍 {item.address}</Text>
      <Text style={styles.detailText}>🏷️ Category: {item.category}</Text>
      <Text style={styles.detailText}>📏 Distance: {item.distance_meters.toFixed(1)} m</Text>
      {item.source && <Text style={styles.detailText}>🌐 Source: {item.source}</Text>}

      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => setSelectedPlace([item.latitude, item.longitude])}
      >
        <Text style={styles.viewBtnText}>View on Map</Text>
      </TouchableOpacity>
    </View>
  );

  const userCenter = [userLocation.latitude, userLocation.longitude];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapBox}>
        <MapContainer center={userCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* ✅ Blue circle for user's location */}
          <CircleMarker
            center={userCenter}
            radius={10}
            color="#007bff"
            fillColor="#007bff"
            fillOpacity={0.6}
          >
            <Popup>You are here</Popup>
          </CircleMarker>

          {/* ✅ Markers within 2 km */}
          {safePlaces.map((p, i) => (
            <Marker
              key={i}
              position={[p.latitude, p.longitude]}
              icon={createColoredIcon(
                p.category === "police" ? "red" : p.category === "hospital" ? "green" : "blue"
              )}
            >
              <Popup>
                <b>{p.name}</b>
                <br />
                {p.address}
                <br />
                📏 {p.distance_meters.toFixed(1)} m away
              </Popup>
            </Marker>
          ))}

          {selectedPlace && <FlyToPlace position={selectedPlace} />}
        </MapContainer>
      </View>

      <View style={styles.listBox}>
        <Text style={styles.heading}>Nearby Safe Places (within 2 km)</Text>

        {Object.entries(grouped).map(([cat, list]) => (
          <View key={cat} style={styles.categoryBlock}>
            <TouchableOpacity onPress={() => toggleDropdown(cat)} style={styles.dropdownHeader}>
              <Text style={styles.categoryTitle}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}s ({list.length})
              </Text>
              <Text style={styles.dropdownArrow}>{dropdowns[cat] ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {dropdowns[cat] && (
              <FlatList
                data={list}
                keyExtractor={(_, index) => `${cat}-${index}`}
                renderItem={renderPlace}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mapBox: { height: 350, margin: 10, borderRadius: 12, overflow: "hidden" },
  listBox: { padding: 10 },
  heading: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
  categoryBlock: {
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 5,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  categoryTitle: { fontSize: 16, fontWeight: "600" },
  dropdownArrow: { fontSize: 18, color: "#333" },
  placeCard: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  placeName: { fontWeight: "bold", fontSize: 15 },
  detailText: { fontSize: 13, color: "#555" },
  viewBtn: {
    backgroundColor: "#007bff",
    marginTop: 6,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewBtnText: { color: "#fff", textAlign: "center", fontSize: 13 },
});

export default MapViewWeb;
