import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { Picker } from '@react-native-picker/picker';
import TranscribedTextBox from './TranscribedTextBox';
import TranscribedList from './TranscribedList';
import styles from '../styles/SpeechToText.styles';

const LANGUAGES = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'Svenska', value: 'sv-SE' },
  { label: 'German', value: 'de-DE' },
  { label: 'French', value: 'fr-FR' },
  // Add more languages as needed
];

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('sv-SE');
  const [acceptedItems, setAcceptedItems] = useState<string[]>([]);

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
        lang: selectedLanguage,
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

  const handleAccept = () => {
    if (transcribedText.trim()) {
      setAcceptedItems([...acceptedItems, transcribedText.trim()]);
      setTranscribedText('');
    }
  };

  const handleClear = () => {
    setTranscribedText('');
  };

  const handleRemoveItem = (index: number) => {
    setAcceptedItems(items => items.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Select Language:</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={setSelectedLanguage}
        style={styles.picker}
      >
        {LANGUAGES.map(lang => (
          <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
        ))}
      </Picker>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={handleRecordButton}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      <TranscribedTextBox
        value={transcribedText}
        onChange={setTranscribedText}
        onAccept={handleAccept}
        onClear={handleClear}
      />
      <TranscribedList items={acceptedItems} onRemove={handleRemoveItem} />
    </View>
  );
}