import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sharedStyles } from '../screens/sharedStyles';
import {
  getTrustedContacts,
  addTrustedContact,
  deleteTrustedContact,
  updateTrustedContact,
} from '../api';

export const TrustedContactsScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = route?.params?.theme || 'light';
  const isDark = theme === 'dark';

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [saving, setSaving] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Fetch contacts from backend on mount
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const res = await getTrustedContacts();
      if (res.ok && res.data) setContacts(res.data);
      else Alert.alert('Error', 'Failed to fetch contacts');
      setLoading(false);
    };
    fetchContacts();
  }, []);

  // Open modal to add a new contact
  const handleAddButton = () => {
    setEditingContact(null);
    setNewContact({ name: '', phone: '', relation: '' });
    setModalVisible(true);
  };

  // Open modal to edit existing contact
  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setNewContact({ name: contact.name, phone: contact.phone, relation: contact.relation });
    setModalVisible(true);
  };

  // Save contact (add or edit)
  const handleSaveContact = async () => {
    console.log('Saving contact:', newContact, 'Editing:', editingContact);

    if (!newContact.name || !newContact.phone || !newContact.relation) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setSaving(true);
    let res;
    if (editingContact) {
      res = await updateTrustedContact(editingContact.id, newContact);
    } else {
      res = await addTrustedContact(newContact);
    }

    console.log('API response:', res);

    if (res.ok && res.data) {
      if (editingContact) {
        setContacts(contacts.map(c => (c.id === editingContact.id ? res.data : c)));
      } else {
        setContacts([...contacts, res.data]);
      }
      setModalVisible(false);
      setNewContact({ name: '', phone: '', relation: '' });
      setEditingContact(null);
    } else {
      Alert.alert('Error', 'Failed to save contact');
    }
    setSaving(false);
  };

  const handleDeleteContact = async (id) => {
    Alert.alert('Delete Contact', 'Are you sure you want to delete?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const res = await deleteTrustedContact(id);
          if (res.ok) setContacts(contacts.filter(c => c.id !== id));
          else Alert.alert('Error', 'Failed to delete contact');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[sharedStyles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ marginTop: 8, color: isDark ? '#F9FAFB' : '#111827' }}>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[sharedStyles.safeArea, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#111827' : '#F3F4F6'} />

      {/* Header */}
      <View style={[sharedStyles.screenHeader, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={sharedStyles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        <Text style={[sharedStyles.screenTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Trusted Contacts</Text>
        <TouchableOpacity onPress={handleAddButton} style={sharedStyles.addButton}>
          <Icon name="add" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={sharedStyles.scrollView} contentContainerStyle={sharedStyles.contentContainer}>
        {/* Info Card */}
        <View style={[sharedStyles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#FEF3C7' }]}>
          <Icon name="info" size={24} color="#F59E0B" />
          <Text style={[sharedStyles.infoText, { color: isDark ? '#FCD34D' : '#92400E' }]}>
            These contacts will receive SOS alerts with your location during emergencies.
          </Text>
        </View>

        {/* Contacts List */}
        <View style={sharedStyles.contactsList}>
          {contacts.map((contact) => (
            <View key={contact.id} style={[sharedStyles.contactCard, { backgroundColor: isDark ? '#374151' : '#FFFFFF' }]}>
              <View style={sharedStyles.contactLeft}>
                <View style={[sharedStyles.contactAvatar, { backgroundColor: isDark ? '#4B5563' : '#E5E7EB' }]}>
                  <Icon name="person" size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </View>
                <View style={sharedStyles.contactInfo}>
                  <Text style={[sharedStyles.contactName, { color: isDark ? '#F9FAFB' : '#111827' }]}>{contact.name}</Text>
                  <Text style={[sharedStyles.contactPhone, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{contact.phone}</Text>
                  <Text style={[sharedStyles.contactRelation, { color: isDark ? '#9CA3AF' : '#9CA3AF' }]}>{contact.relation}</Text>
                </View>
              </View>

              <View style={sharedStyles.contactActions}>
                <TouchableOpacity style={sharedStyles.actionButton} onPress={() => handleEditContact(contact)}>
                  <Icon name="edit" size={22} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity style={sharedStyles.actionButton} onPress={() => Alert.alert('Call', `Calling ${contact.name}`)}>
                  <Icon name="phone" size={22} color="#22C55E" />
                </TouchableOpacity>
                <TouchableOpacity style={sharedStyles.actionButton} onPress={() => handleDeleteContact(contact.id)}>
                  <Icon name="delete" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {contacts.length === 0 && (
          <View style={sharedStyles.emptyState}>
            <Icon name="contacts" size={64} color={isDark ? '#4B5563' : '#D1D1DDB'} />
            <Text style={[sharedStyles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              No trusted contacts added yet
            </Text>
            <TouchableOpacity style={sharedStyles.addContactButton} onPress={handleAddButton}>
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={sharedStyles.addContactButtonText}>Add First Contact</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* Go to Homepage Button */}
<View style={{ padding: 16, alignItems: 'center' }}>
  <TouchableOpacity
    onPress={() => navigation.navigate('HomePage')} // Replace 'Home' with your actual home screen route name
    style={{
      backgroundColor: '#8B5CF6',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <Icon name="home" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Go to Homepage</Text>
  </TouchableOpacity>
</View>


      {/* Add/Edit Contact Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: '#000000AA', justifyContent: 'center', padding: 20 }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => null}>
            <View style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 12, padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12, color: isDark ? '#F9FAFB' : '#111827' }}>
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </Text>

              {['name', 'phone', 'relation'].map((key) => (
                <TextInput
                  key={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={newContact[key]}
                  onChangeText={(text) => setNewContact({ ...newContact, [key]: text })}
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? '#4B5563' : '#E5E7EB',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    color: isDark ? '#F9FAFB' : '#111827',
                    backgroundColor: isDark ? '#374151' : '#F9FAFB',
                  }}
                />
              ))}

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setNewContact({ name: '', phone: '', relation: '' });
                    setEditingContact(null);
                  }}
                  style={{ marginRight: 12 }}
                >
                  <Text style={{ color: '#EF4444', fontWeight: '700' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSaveContact} disabled={saving}>
                  <Text style={{ color: '#22C55E', fontWeight: '700' }}>{saving ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TrustedContactsScreen;
