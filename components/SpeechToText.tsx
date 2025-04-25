import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import { 
  ExpoSpeechRecognitionModule, 
  useSpeechRecognitionEvent 
} from 'expo-speech-recognition';

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  useSpeechRecognitionEvent("result", (event) => {
      if (event && event.results[0].transcript !== undefined) {
        setTranscribedText(event.results[0].transcript);
      }
    });
useSpeechRecognitionEvent("error", (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    });
  useSpeechRecognitionEvent("end", () => {
      setIsRecording(false);
    });

  const startRecording = async () => {
    try {
      const audioPermResult = await Audio.requestPermissionsAsync();
      const speechReckPermResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!audioPermResult.granted || !speechReckPermResult.granted) {
        console.warn("Permissions not granted. 1. AudioPermission. 2. SpeechReckPermission", audioPermResult, speechReckPermResult);
        return;
      }
      setIsRecording(true);
      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        continuous: false,
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const handleRecordButton = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={handleRecordButton}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Transcribed Text:</Text>
        <TextInput
          style={styles.textInput}
          value={transcribedText}
          onChangeText={setTranscribedText}
          multiline
          placeholder="Your speech will appear here..."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    minHeight: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    backgroundColor: '#fff',
    color: '#333',
    marginTop: 5,
  },
});