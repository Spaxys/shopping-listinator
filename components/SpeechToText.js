import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
//import * as Speech from 'expo-speech';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const startRecording = async () => {
    let result;
    try {
      
       result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
      setIsRecording(true);
      // Start listening for speech
      //const result = await Speech.startListeningAsync();
      // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
      if (result) {
        setTranscribedText(result.text);
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={startRecording}
        disabled={isRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={ExpoSpeechRecognitionModule.stop()}
        disabled={!isRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      
      {transcribedText ? (
        <View style={styles.textContainer}>
          <Text style={styles.text}>Transcribed Text:</Text>
          <Text style={styles.transcribedText}>{transcribedText}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  transcribedText: {
    fontSize: 18,
    color: '#333',
  },
}); 