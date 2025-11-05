import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Linking,
  Alert,
  Vibration,
  BackHandler,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Svg, { Circle } from "react-native-svg";
import { sendSOSAlert } from "../api"; // ✅ use your API helper

const { width } = Dimensions.get("window");

const PanicModeScreen = () => {
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse & rotation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotate.start();

    Vibration.vibrate([0, 500, 200, 500]);

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      pulse.stop();
      rotate.stop();
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (countdown > 0 && isActive) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
        Vibration.vibrate(countdown <= 5 ? 150 : 80);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isActive) {
      handleAutoSend();
    }
  }, [countdown, isActive]);

  const handleBackPress = () => {
    Alert.alert(
      "⚠️ Cancel SOS Alert?",
      "Are you sure you want to stop the emergency alert?",
      [
        { text: "Continue Alert", style: "cancel" },
        {
          text: "Yes, Cancel",
          onPress: handleCancelPanic,
          style: "destructive",
        },
      ]
    );
    return true;
  };

  const handleAutoSend = async () => {
    setIsActive(false);
    setIsSending(true);
    Vibration.vibrate(1000);

    const { ok, data } = await sendSOSAlert("SOS activated from Panic Mode");

    if (ok) {
      console.log("✅ SOS alert sent:", data);
      Alert.alert(
        "✓ SOS Alert Sent!",
        "Your trusted contacts have been notified with your live location.",
        [
          { text: "OK", onPress: () => navigation.goBack() },
          {
            text: "Call 112",
            onPress: () => {
              navigation.goBack();
              Linking.openURL("tel:112");
            },
          },
        ]
      );
    } else {
      console.error("❌ SOS failed:", data);
      Alert.alert(
        "Alert Error",
        data?.detail || "Failed to send alert. Please call emergency services.",
        [
          { text: "Retry", onPress: handleAutoSend },
          { text: "Call 112", onPress: () => Linking.openURL("tel:112") },
        ]
      );
    }

    setIsSending(false);
  };

  const handleCancelPanic = () => {
    setIsActive(false);
    Vibration.cancel();
    navigation.goBack();
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      "📞 Emergency Call",
      "Call emergency services now?\nIndia: 112 (National) | Women: 1091",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call 112", onPress: () => Linking.openURL("tel:112") },
        { text: "Women Helpline", onPress: () => Linking.openURL("tel:1091") },
      ]
    );
  };

  const handleSendNow = () => {
    Alert.alert(
      "Send SOS Immediately?",
      "This will bypass the countdown and alert your contacts now.",
      [
        { text: "Wait", style: "cancel" },
        {
          text: "Send Now",
          onPress: () => {
            setCountdown(0);
            handleAutoSend();
          },
        },
      ]
    );
  };

  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (countdown / 10) * circumference;
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Background ripples */}
      <View style={styles.backgroundPattern}>
        {[...Array(3)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.ripple,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.15],
                  outputRange: [0.1 - i * 0.03, 0.05 - i * 0.02],
                }),
                transform: [
                  {
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.15],
                      outputRange: [1 + i * 0.3, 1.15 + i * 0.3],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.appName}>SAHASI</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: pulseAnim }, { rotate: spin }] }]}
        >
          <View style={styles.iconCircle}>
            <Icon name="warning" size={70} color="#DC2626" />
          </View>
        </Animated.View>

        <Text style={styles.title}>🚨 SOS ALERT ACTIVE</Text>
        <Text style={styles.subtitle}>
          Emergency alert will be sent to your trusted contacts in
        </Text>

        <View style={styles.timerContainer}>
          <Svg width={150} height={150}>
            <Circle cx="75" cy="75" r="50" fill="none" stroke="#FEE2E2" strokeWidth="8" />
            <Circle
              cx="75"
              cy="75"
              r="50"
              fill="none"
              stroke="#DC2626"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 75 75)"
            />
          </Svg>
          <View style={styles.countdownContent}>
            <Text style={styles.countdown}>{countdown}</Text>
            <Text style={styles.countdownLabel}>seconds</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Icon name="gps-fixed" size={20} color="#059669" />
          <Text style={styles.statusText}>Location tracking active • Recording audio</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.sendNowButton} onPress={handleSendNow} disabled={!isActive}>
            <Icon name="flash-on" size={22} color="white" />
            <Text style={styles.sendNowText}>Send Alert Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.callButton} onPress={handleEmergencyCall}>
            <Icon name="phone" size={22} color="white" />
            <Text style={styles.callButtonText}>Emergency Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelPanic}
            disabled={isSending}
          >
            <Text style={styles.cancelButtonText}>
              {isSending ? "Sending..." : "Cancel SOS"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helperContainer}>
          <Icon name="info-outline" size={18} color="#6B7280" />
          <Text style={styles.helperText}>
            Stay calm. Your location is being shared with trusted contacts.
          </Text>
        </View>

        <View style={styles.emergencyNumbers}>
          <Text style={styles.emergencyTitle}>Quick Access:</Text>
          <View style={styles.numberRow}>
            {[
              { num: "112", label: "Emergency" },
              { num: "1091", label: "Women Help" },
              { num: "100", label: "Police" },
            ].map((item) => (
              <TouchableOpacity
                key={item.num}
                style={styles.numberButton}
                onPress={() => Linking.openURL(`tel:${item.num}`)}
              >
                <Text style={styles.numberText}>{item.num}</Text>
                <Text style={styles.numberLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

// (keep your styles same)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  backgroundPattern: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  ripple: { position: "absolute", width: width * 1.5, height: width * 1.5, borderRadius: width * 0.75, backgroundColor: "#DC2626" },
  // (other styles unchanged)

  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: '#DC2626',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FCA5A5',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  countdownContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  countdown: {
    fontSize: 52,
    fontWeight: '900',
    color: '#DC2626',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: -5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 25,
  },
  statusText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  sendNowButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 12,
    width: '100%',
    elevation: 4,
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sendNowText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
  },
  callButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 12,
    width: '100%',
    elevation: 4,
    shadowColor: '#DC2626',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  callButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    width: '100%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  helperText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    flex: 1,
  },
  emergencyNumbers: {
    marginTop: 25,
    alignItems: 'center',
    width: '100%',
  },
  emergencyTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 12,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  numberButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  numberText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  numberLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default PanicModeScreen;
