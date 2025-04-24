import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
//import * as Speech from 'expo-speech';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Audio } from 'expo-av';

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  useSpeechRecognitionEvent("start", () => setIsRecording(true));
  useSpeechRecognitionEvent("end", () => setIsRecording(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscribedText(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const startRecording = async () => {
    let audioPermResult;
    let speechReckPermResult;
    try {
       audioPermResult = await Audio.requestPermissionsAsync();
       speechReckPermResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!audioPermResult.granted || !speechReckPermResult.granted) {
      console.warn("Permissions not granted. 1. AudioPermission. 2. SpeechReckPermission", audioPermResult, speechReckPermResult);
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
      if (speechReckPermResult) {
        setTranscribedText(speechReckPermResult.text);
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
        onPress={ExpoSpeechRecognitionModule.stop}
        disabled={!isRecording}
      >
        <Text style={styles.buttonText}>
          Stop Recording
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