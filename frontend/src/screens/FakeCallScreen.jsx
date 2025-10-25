import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Animated,
  Dimensions,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Audio } from 'expo-av';

// IMPORTANT: Place your ringtone.mp3 file in the assets folder
// Example: assets/sounds/ringtone.mp3
// Then require it like: require('./assets/sounds/ringtone.mp3')
const RINGTONE_FILE = require('../../assets/sounds/ringtone.mp3');

const FakeCallScreen = ({
  callerName = 'Security Contact',
  callerSubtitle = 'Incoming Call',
  callerAvatar = null,
  onEnd,
}) => {
  const [callState, setCallState] = useState('ringing'); // 'ringing' or 'active'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Audio management refs
  const ringtoneRef = useRef(null);
  const vibrationIntervalRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Initialize audio and ringtone on mount
  useEffect(() => {
    const setupAudio = async () => {
      if (callState === 'ringing') {
        try {
          // Set audio mode for ringing
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });

          // Start vibration pattern (vibrate for 1s, pause for 0.5s, repeat)
          const vibratePattern = [0, 1000, 500];
          Vibration.vibrate(vibratePattern, true); // true = repeat

          // Load and play ringtone using expo-av
          const { sound } = await Audio.Sound.createAsync(
            RINGTONE_FILE,
            {
              shouldPlay: true,
              isLooping: true, // Loop the ringtone indefinitely
              volume: 1.0,
            }
          );

          ringtoneRef.current = sound;

          // Pulsing animation for ringing state
          const pulse = Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.05,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
            ])
          );
          pulse.start();

          return () => {
            pulse.stop();
          };
        } catch (error) {
          console.error('Error setting up ringtone:', error);
        }
      }
    };

    setupAudio();
  }, [callState, pulseAnim]);

  // Call duration timer for active calls
  useEffect(() => {
    let interval;
    if (callState === 'active') {
      interval = setInterval(() => {
        setCallDuration((prev) => {
          if (prev >= 59) {
            // Auto-end after 60 seconds
            handleEndCall();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = async () => {
    // Stop vibration
    Vibration.cancel();

    // Stop and unload ringtone
    if (ringtoneRef.current) {
      try {
        await ringtoneRef.current.stopAsync();
        await ringtoneRef.current.unloadAsync();
        ringtoneRef.current = null;
      } catch (error) {
        console.error('Error cleaning up audio:', error);
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = async () => {
    try {
      // Stop vibration
      Vibration.cancel();

      // Stop and unload the ringtone
      if (ringtoneRef.current) {
        await ringtoneRef.current.stopAsync();
        await ringtoneRef.current.unloadAsync();
        ringtoneRef.current = null;
      }

      // Switch to active call audio mode (earpiece/speaker mode)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: !isSpeaker,
      });

      // Fade out and transition to active call
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCallState('active');
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const handleDecline = () => {
    animateButtonPress(() => {
      cleanupAndEnd();
    });
  };

  const handleEndCall = () => {
    animateButtonPress(() => {
      cleanupAndEnd();
    });
  };

  const cleanupAndEnd = async () => {
    await cleanupAudio();
    onEnd();
  };

  const animateButtonPress = (callback) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Note: In a real app, you would mute the microphone here
    // This is a visual-only implementation for the fake call
  };

  const toggleSpeaker = async () => {
    const newSpeakerState = !isSpeaker;
    setIsSpeaker(newSpeakerState);
    
    try {
      // Update audio mode for speaker
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: !newSpeakerState,
      });
    } catch (error) {
      console.error('Error toggling speaker:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Caller Info Section */}
        <View style={styles.callerInfoSection}>
          <Animated.View
            style={[
              styles.avatarContainer,
              callState === 'ringing' && { transform: [{ scale: pulseAnim }] },
            ]}
          >
            {callerAvatar ? (
              <Image source={callerAvatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={60} color="#6B7280" />
              </View>
            )}
          </Animated.View>

          <Text style={styles.callerName}>{callerName}</Text>
          <Text style={styles.callerSubtitle}>
            {callState === 'ringing' ? callerSubtitle : formatDuration(callDuration)}
          </Text>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionsSection}>
          {callState === 'ringing' ? (
            // Ringing State: Decline & Answer
            <View style={styles.ringingButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineButton]}
                onPress={handleDecline}
                activeOpacity={0.7}
              >
                <Icon name="phone-hangup" size={36} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.answerButton]}
                onPress={handleAnswer}
                activeOpacity={0.7}
              >
                <Icon name="phone" size={36} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            // Active State: Mute, Speaker, End Call
            <View style={styles.activeCallButtons}>
              <View style={styles.controlRow}>
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    isMuted && styles.controlButtonActive,
                  ]}
                  onPress={toggleMute}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={isMuted ? 'microphone-off' : 'microphone'}
                    size={28}
                    color="#FFFFFF"
                  />
                  <Text style={styles.controlLabel}>
                    {isMuted ? 'Unmute' : 'Mute'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    isSpeaker && styles.controlButtonActive,
                  ]}
                  onPress={toggleSpeaker}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={isSpeaker ? 'volume-high' : 'volume-medium'}
                    size={28}
                    color="#FFFFFF"
                  />
                  <Text style={styles.controlLabel}>
                    {isSpeaker ? 'Speaker' : 'Audio'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.endCallButton]}
                  onPress={handleEndCall}
                  activeOpacity={0.7}
                >
                  <Icon name="phone-hangup" size={36} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  callerInfoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  avatarContainer: {
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1F2937',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#374151',
  },
  callerName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  callerSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  actionsSection: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  ringingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  actionButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  declineButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.6,
  },
  answerButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.6,
  },
  endCallButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.6,
    marginTop: 32,
    alignSelf: 'center',
  },
  activeCallButtons: {
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 16,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  controlButtonActive: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D1D5DB',
    marginTop: 6,
  },
});

export default FakeCallScreen;