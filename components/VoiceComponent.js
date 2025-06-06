import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "@jamsch/expo-speech-recognition";

export default function VoiceComponent() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Listen to speech result
  useSpeechRecognitionEvent("result", (event) => {
    if (event?.results?.transcript) {
      const text = event.results.transcript;
      setTranscript(text);
      handleVoiceCommand(text);
    }
  });

  // Handle commands in Urdu + English
  const handleVoiceCommand = (text) => {
    const lower = text.toLowerCase();

    if (
      lower.includes("open home") ||
      lower.includes("go home") ||
      lower.includes("چلو") ||
      lower.includes("ہوم کھولو")
    ) {
      Alert.alert("✅ Command", "Navigating to Home...");
      // navigation.navigate('Home');
    }

    if (
      lower.includes("open profile") ||
      lower.includes("profile") ||
      lower.includes("پروفائل") ||
      lower.includes("پروفائل کھولو")
    ) {
      Alert.alert("✅ Command", "Opening Profile...");
      // navigation.navigate('Profile');
    }

    if (
      lower.includes("stop") ||
      lower.includes("رکو")
    ) {
      handleStop();
    }
  };

  const handleStart = async () => {
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (granted) {
      await ExpoSpeechRecognitionModule.start({
        lang: "ur-PK", // Also handles English phrases
        interimResults: true,
      });
      setIsListening(true);
    }
  };

  const handleStop = async () => {
    await ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎤 Voice Command (Urdu + English)</Text>
      <Button
        title={isListening ? "Stop Listening" : "Start Listening"}
        onPress={isListening ? handleStop : handleStart}
      />
      <Text style={styles.transcript}>🗣️ {transcript}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  transcript: { marginTop: 20, fontSize: 18, color: "darkgreen" },
});
