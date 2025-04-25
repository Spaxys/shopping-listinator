import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { 
  ExpoSpeechRecognitionModule, 
  useSpeechRecognitionEvent 
} from 'expo-speech-recognition';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

const LANGUAGES = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'Svenska', value: 'sv-SE' },
  { label: 'German', value: 'de-DE' },
  { label: 'French', value: 'fr-FR' },
  // Add more languages as needed
];

type TranscribedTextBoxProps = {
  value: string;
  onChange: (text: string) => void;
  onAccept: () => void;
  onClear: () => void;
};

function TranscribedTextBox({ value, onChange, onAccept, onClear }: TranscribedTextBoxProps) {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.text}>Transcribed Text:</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        multiline
        placeholder="Your speech will appear here..."
      />
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={onAccept} disabled={!value.trim()}>
          <MaterialIcons name="check-circle" size={32} color={value.trim() ? 'green' : '#ccc'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClear} disabled={!value.trim()}>
          <MaterialIcons name="delete" size={32} color={value.trim() ? 'red' : '#ccc'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

type TranscribedListProps = {
  items: string[];
};

function TranscribedList({ items }: TranscribedListProps) {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.text}>Accepted Items:</Text>
      <FlatList
        data={items}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyListText}>No items yet.</Text>}
      />
    </View>
  );
}

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
      <TranscribedList items={acceptedItems} />
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
  picker: {
    marginBottom: 16,
    backgroundColor: '#fff',
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
    marginBottom: 8,
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
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 16,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  listItem: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  listItemText: {
    fontSize: 16,
    color: '#222',
  },
  emptyListText: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
});