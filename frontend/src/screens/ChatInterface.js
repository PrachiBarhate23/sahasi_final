import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import ChatBubble from '../components/ChatBubble';
import { styles } from '../styles/styles';

const API_BASE = 'https://your-backend-url.com/api'; // replace later

const savePendingMessage = async (contactId, message) => {
  const key = `pendingMessages_${contactId}`;
  const existing = JSON.parse(await AsyncStorage.getItem(key)) || [];
  existing.push(message);
  await AsyncStorage.setItem(key, JSON.stringify(existing));
};

const syncPendingMessages = async (contactId, currentUserId, setMessages) => {
  try {
    const pendingKey = `pendingMessages_${contactId}`;
    const chatKey = `chat_${contactId}`;
    const pending = await AsyncStorage.getItem(pendingKey);
    if (!pending) return;

    const pendingMessages = JSON.parse(pending);
    if (!pendingMessages.length) return;

    const successfullySent = [];

    for (const msg of pendingMessages) {
      const res = await fetch(`${API_BASE}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: currentUserId,
          receiver: contactId,
          message: msg.text,
        }),
      });
      if (res.ok) successfullySent.push(msg.id);
    }

    const existing = JSON.parse(await AsyncStorage.getItem(chatKey)) || [];
    const updatedChat = existing.map((m) =>
      successfullySent.includes(m.id) ? { ...m, sent: true } : m
    );

    await AsyncStorage.setItem(chatKey, JSON.stringify(updatedChat));
    await AsyncStorage.removeItem(pendingKey);
    setMessages(updatedChat);
  } catch (err) {
    console.warn('⚠️ Sync failed:', err);
  }
};

const ChatInterface = ({ route, navigation }) => {
  const { contact } = route.params;
  const currentUserId = 1; // Replace with logged-in user ID
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        await syncPendingMessages(contact.id, currentUserId, setMessages);
        await loadMessages();
      }
    });

    loadMessages();
    return () => unsubscribe();
  }, [contact.id]);

  const loadMessages = async () => {
    try {
      const localData = await AsyncStorage.getItem(`chat_${contact.id}`);
      if (localData) setMessages(JSON.parse(localData));

      if (isOnline) {
        const res = await fetch(`${API_BASE}/messages/?contact=${contact.id}`);
        const data = await res.json();
        setMessages(data);
        await AsyncStorage.setItem(`chat_${contact.id}`, JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      sender: currentUserId,
      receiver: contact.id,
      sent: isOnline,
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    setInputText('');
    await AsyncStorage.setItem(`chat_${contact.id}`, JSON.stringify(updated));
    Keyboard.dismiss();

    if (isOnline) {
      try {
        await fetch(`${API_BASE}/messages/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: currentUserId,
            receiver: contact.id,
            message: newMessage.text,
          }),
        });
      } catch (err) {
        await savePendingMessage(contact.id, { ...newMessage, sent: false });
      }
    } else {
      await savePendingMessage(contact.id, { ...newMessage, sent: false });
      Alert.alert('Offline', 'Message saved locally and will sync later.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image source={{ uri: contact.avatar }} style={styles.headerAvatar} />
        <Text style={styles.headerTitle}>{contact.name}</Text>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContent}
        contentContainerStyle={{ paddingBottom: 16 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={{ marginBottom: 8 }}>
            <ChatBubble message={msg} />
            {!msg.sent && (
              <Text
                style={{
                  fontSize: 10,
                  color: 'gray',
                  alignSelf: msg.sender === currentUserId ? 'flex-end' : 'flex-start',
                  marginRight: 10,
                }}
              >
                ⏳ Pending
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInterface;
