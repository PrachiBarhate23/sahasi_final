// ==================== TrustedContactsScreen.jsx ====================
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sharedStyles } from '../screens/sharedStyles'; // adjust path as needed

export const TrustedContactsScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = route?.params?.theme || 'light';
  const isDark = theme === 'dark';

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', phone: '+91 98765 12345', relation: 'Mother' },
    { id: 2, name: 'Dad', phone: '+91 98765 54321', relation: 'Father' },
    { id: 3, name: 'Best Friend', phone: '+91 98765 11111', relation: 'Friend' },
  ]);

  const handleAddContact = () => {
    Alert.alert('Add Contact', 'Enter contact details', [
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <SafeAreaView
      style={[
        sharedStyles.safeArea,
        { backgroundColor: isDark ? '#111827' : '#F3F4F6' },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#F3F4F6'}
      />

      <View
        style={[
          sharedStyles.screenHeader,
          { borderBottomColor: isDark ? '#374151' : '#E5E7EB' },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={sharedStyles.backButton}>
          <Icon name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        <Text style={[sharedStyles.screenTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
          Trusted Contacts
        </Text>
        <TouchableOpacity onPress={handleAddContact} style={sharedStyles.addButton}>
          <Icon name="add" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={sharedStyles.scrollView}
        contentContainerStyle={sharedStyles.contentContainer}
      >
        <View style={[sharedStyles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#FEF3C7' }]}>
          <Icon name="info" size={24} color="#F59E0B" />
          <Text style={[sharedStyles.infoText, { color: isDark ? '#FCD34D' : '#92400E' }]}>
            These contacts will receive SOS alerts with your location during emergencies.
          </Text>
        </View>

        <View style={sharedStyles.contactsList}>
          {contacts.map((contact) => (
            <View
              key={contact.id}
              style={[
                sharedStyles.contactCard,
                {
                  backgroundColor: isDark ? '#374151' : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                },
              ]}
            >
              <View style={sharedStyles.contactLeft}>
                <View style={[sharedStyles.contactAvatar, { backgroundColor: isDark ? '#4B5563' : '#E5E7EB' }]}>
                  <Icon name="person" size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </View>
                <View style={sharedStyles.contactInfo}>
                  <Text style={[sharedStyles.contactName, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                    {contact.name}
                  </Text>
                  <Text style={[sharedStyles.contactPhone, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
                    {contact.phone}
                  </Text>
                  <Text style={[sharedStyles.contactRelation, { color: isDark ? '#9CA3AF' : '#9CA3AF' }]}>
                    {contact.relation}
                  </Text>
                </View>
              </View>

              <View style={sharedStyles.contactActions}>
                <TouchableOpacity
                  style={sharedStyles.actionButton}
                  onPress={() => Alert.alert('Call', `Calling ${contact.name}`)}
                >
                  <Icon name="phone" size={22} color="#22C55E" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={sharedStyles.actionButton}
                  onPress={() => handleDeleteContact(contact.id)}
                >
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
            <TouchableOpacity style={sharedStyles.addContactButton} onPress={handleAddContact}>
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={sharedStyles.addContactButtonText}>Add First Contact</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrustedContactsScreen;
