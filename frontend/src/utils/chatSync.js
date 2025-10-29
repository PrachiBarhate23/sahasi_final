import AsyncStorage from '@react-native-async-storage/async-storage';

export const syncPendingMessages = async (contactId, currentUserId, API_BASE) => {
  try {
    const pendingKey = `pendingMessages_${contactId}`;
    const pending = await AsyncStorage.getItem(pendingKey);
    if (!pending) return;

    const pendingMessages = JSON.parse(pending);
    if (!pendingMessages.length) return;

    for (const msg of pendingMessages) {
      await fetch(`${API_BASE}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
    }

    // Clear the pending queue after successful sync
    await AsyncStorage.removeItem(pendingKey);
    console.log(`✅ Synced ${pendingMessages.length} messages with ${contactId}`);
  } catch (err) {
    console.warn('⚠️ Sync failed, will retry later:', err);
  }
};
