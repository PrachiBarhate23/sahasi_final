import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSafePlaces } from "../api";

const MapPage = ({ navigation, route }) => {
  const { theme = "light" } = route.params || {};
  const [userLocation, setUserLocation] = useState(null);
  const [safePlaces, setSafePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdowns, setDropdowns] = useState({});
  const [error, setError] = useState(null);

  // ✅ Watch real-time location
  useEffect(() => {
    let subscription;
    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          setLoading(false);
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          async (loc) => {
            const coords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setUserLocation(coords);
            await fetchSafePlaces(coords.latitude, coords.longitude);
          }
        );
      } catch (err) {
        console.error("Location watch error:", err);
        setError("Unable to track location");
      } finally {
        setLoading(false);
      }
    };

    startWatching();
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // ✅ Fetch safe places dynamically
  const fetchSafePlaces = async (lat, lng) => {
    try {
      const res = await getSafePlaces(lat, lng);
      if (res.ok && Array.isArray(res.data)) {
        const nearby = res.data.filter((p) => p.distance_meters <= 2000);
        const sorted = nearby.sort((a, b) => {
          if (a.category === "police" && b.category !== "police") return -1;
          if (b.category === "police" && a.category !== "police") return 1;
          return a.distance_meters - b.distance_meters;
        });
        setSafePlaces(sorted);
        const cats = [...new Set(sorted.map((p) => p.category))];
        const initDropdowns = {};
        cats.forEach((c) => (initDropdowns[c] = false));
        setDropdowns(initDropdowns);
      }
    } catch (err) {
      console.error("Error fetching safe places:", err);
      setError("Failed to load safe places");
    }
  };

  const toggleDropdown = (cat) =>
    setDropdowns((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const getMarkerColor = (category) => {
    switch (category) {
      case "police":
        return "#EF4444";
      case "hospital":
        return "#10B981";
      case "shelter":
        return "#3B82F6";
      default:
        return "#6366F1";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EF4444" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </SafeAreaView>
    );
  }

  if (error || !userLocation) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Header theme={theme} />
        <View style={styles.errorContent}>
          <Icon name="map-marker-off" size={64} color="#EF4444" />
          <Text style={styles.errorText}>
            {error || "Unable to access your location"}
          </Text>
        </View>
        <Footer theme={theme} navigation={navigation} />
      </SafeAreaView>
    );
  }

  const grouped = safePlaces.reduce((acc, p) => {
    const cat = p.category || "unknown";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <Header theme={theme} />
      <View style={styles.mapContainer}>
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
        >
          <Circle
            center={userLocation}
            radius={200}
            strokeColor="#3B82F6"
            fillColor="rgba(59,130,246,0.2)"
          />

          {safePlaces.map((p, i) => (
            <Marker
              key={i}
              coordinate={{
                latitude: p.latitude,
                longitude: p.longitude,
              }}
              title={p.name}
              description={`${p.address || ""}\n${p.distance_meters.toFixed(
                1
              )} m away`}
              pinColor={getMarkerColor(p.category)}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.listBox}>
        <Text style={styles.heading}>Nearby Safe Places (within 2 km)</Text>
        {Object.entries(grouped).map(([cat, list]) => (
          <View key={cat} style={styles.categoryBlock}>
            <TouchableOpacity
              onPress={() => toggleDropdown(cat)}
              style={styles.dropdownHeader}
            >
              <Text style={styles.categoryTitle}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}s ({list.length})
              </Text>
              <Text style={styles.dropdownArrow}>
                {dropdowns[cat] ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {dropdowns[cat] && (
              <FlatList
                data={list}
                keyExtractor={(_, i) => `${cat}-${i}`}
                renderItem={({ item }) => (
                  <View style={styles.placeCard}>
                    <Text style={styles.placeName}>{item.name}</Text>
                    <Text style={styles.detailText}>📍 {item.address}</Text>
                    <Text style={styles.detailText}>
                      📏 {item.distance_meters.toFixed(1)} m away
                    </Text>
                    <Text style={styles.detailText}>
                      🏷️ {item.category || "Unknown"}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        ))}
      </View>

      <Footer theme={theme} navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#6B7280" },
  errorContainer: { flex: 1, backgroundColor: "#fff" },
  errorContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { marginTop: 20, fontSize: 18, color: "#1F2937" },
  mapContainer: { height: 350, margin: 10, borderRadius: 12, overflow: "hidden" },
  listBox: { padding: 10 },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  categoryBlock: {
    marginBottom: 10,
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
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  placeName: { fontWeight: "bold", fontSize: 15 },
  detailText: { fontSize: 13, color: "#555" },
});

export default MapPage;
