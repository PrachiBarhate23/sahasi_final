import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from '../styles/styles';

const ContactItem = ({ contact, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.contactItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: contact.avatar }} 
        style={styles.contactAvatar} 
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text 
          style={styles.contactLastMessage} 
          numberOfLines={1}
        >
          {contact.lastMessage}
        </Text>
      </View>
      <View style={styles.contactMeta}>
        <Text style={styles.contactTime}>{contact.time}</Text>
        {contact.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{contact.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ContactItem;