import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';

const ChatBubble = ({ message }) => {
  const isSent = message.sent;
  
  return (
    <View
      style={[
        styles.messageBubble,
        isSent ? styles.sentBubble : styles.receivedBubble,
      ]}
    >
      <Text 
        style={[
          styles.messageText, 
          isSent ? styles.sentText : styles.receivedText
        ]}
      >
        {message.text}
      </Text>
      <Text 
        style={[
          styles.messageTime, 
          isSent ? styles.sentTime : styles.receivedTime
        ]}
      >
        {message.time}
      </Text>
    </View>
  );
};

export default ChatBubble;