// src/api.js

// =======================
// Configure API base URL
// =======================

export const API_BASE_URL =  'https://better-ants-smash.loca.lt';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ================= LOGIN API =================
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Non-JSON response:', text);
      data = { detail: 'Invalid response from server' };
    }

    return { ok: response.ok, data };
  } catch (error) {
    console.error('Login API error:', error);
    return { ok: false, data: { detail: 'Network error' } };
  }
};


// ================= REGISTER API =================
export const registerUser = async ({ first_name, last_name, phone, email, username, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, phone, email, username, password }),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } 
    catch { data = { detail: 'Invalid response from server' }; }

    return { ok: response.ok, data };
  } catch (error) {
    return { ok: false, data: { detail: 'Network error' } };
  }
};

// ================= GET USER PROFILE =================
export const getUserProfile = async (token) => {
  console.log('Fetching profile with token:', token); // <-- debug token
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Pass the token here
      },
    });

    const text = await response.text();
    console.log('Raw response from /me/:', text); // <-- debug server response

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Non-JSON response:', text);
      data = { detail: 'Invalid response from server' };
    }

    return { ok: response.ok, data };
  } catch (error) {
    console.error('Get profile API error:', error);
    return { ok: false, data: { detail: 'Network error' } };
  }
};

// ================= UPDATE USER PROFILE =================
export const updateUserProfile = async (token, profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/profile/update/`, {  // <-- use correct path
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: 'Invalid response from server' };
    }

    return { ok: response.ok, data };
  } catch (error) {
    return { ok: false, data: { detail: 'Network error' } };
  }
};

const TRUSTED_CONTACTS_BASE = `${API_BASE_URL}/api/users/trusted-contacts/`;

export const getTrustedContacts = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found');

    const res = await fetch(TRUSTED_CONTACTS_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.error('getTrustedContacts Error:', err);
    return { ok: false, data: null };
  }
};

export const addTrustedContact = async (contact) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found');

    const res = await fetch(TRUSTED_CONTACTS_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contact),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.error('addTrustedContact Error:', err);
    return { ok: false, data: null };
  }
};

export const updateTrustedContact = async (id, contact) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found');

    const res = await fetch(`${TRUSTED_CONTACTS_BASE}${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contact),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.error('updateTrustedContact Error:', err);
    return { ok: false, data: null };
  }
};

export const deleteTrustedContact = async (id) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found');

    const res = await fetch(`${TRUSTED_CONTACTS_BASE}${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    let data = {};
    try { data = await res.json(); } catch {}

    return { ok: res.ok, data };
  } catch (err) {
    console.error('deleteTrustedContact Error:', err);
    return { ok: false, data: null };
  }
};

// ================= SAFE PLACES =================
export const getSafePlaces = async (lat, lng) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found');

    const res = await fetch(`${API_BASE_URL}/api/users/safeplaces/merged/?lat=${lat}&lng=${lng}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.error('getSafePlaces Error:', err);
    return { ok: false, data: [] };
  }
};
// ================= CURRENT LOCATION (FETCH + UPDATE) =================

// ✅ Get current location from backend (GET)
export const fetchCurrentLocation = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await fetch(`${API_BASE_URL}/api/users/location/current/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.error("fetchCurrentLocation Error:", err);
    return { ok: false, data: { detail: err.message } };
  }
};

// ✅ Update user location to backend (POST)
export const updateUserLocation = async (latitude, longitude) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await fetch(`${API_BASE_URL}/api/users/location/update/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }

    return { ok: res.ok, data };
  } catch (err) {
    console.error("updateUserLocation Error:", err);
    return { ok: false, data: { detail: err.message } };
  }
};


// ================= SEND SOS ALERT =================
export const sendSOSAlert = async (message = "") => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const res = await fetch(`${API_BASE_URL}/api/users/sos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Invalid JSON response:", text);
      data = { detail: text };
    }

    return { ok: res.ok, data };
  } catch (err) {
    console.error("sendSOSAlert Error:", err);
    return { ok: false, data: { detail: err.message } };
  }
};

