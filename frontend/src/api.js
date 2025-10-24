// src/api.js

// =======================
// Configure API base URL
// =======================

// For mobile via Expo tunnel or local IP
// Replace with your ngrok/localhost IP:port
export const API_BASE_URL =  'http://127.0.0.1:8000';

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
