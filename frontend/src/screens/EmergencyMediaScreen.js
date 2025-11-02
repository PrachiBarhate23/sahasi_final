import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { Video } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../api";

export default function EmergencyMediaScreen() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("No JWT token found");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/users/emergency-media/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Error fetching media:", res.status);
          return;
        }

        const data = await res.json();
        setMedia(data);
      } catch (error) {
        console.error("Fetch media failed:", error);
      }
    };

    fetchMedia();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.media_type === "photo" ? (
        <Image source={{ uri: item.media }} style={styles.media} />
      ) : (
        <Video
          source={{ uri: item.media }}
          useNativeControls
          resizeMode="cover"
          style={styles.media}
        />
      )}
      <Text style={styles.text}>
        {item.media_type.toUpperCase()} —{" "}
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Media 📸</Text>
      <FlatList
        data={media}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },
  media: {
    width: "100%",
    height: 220,
    borderRadius: 10,
  },
  text: {
    marginTop: 6,
    color: "#555",
  },
});
