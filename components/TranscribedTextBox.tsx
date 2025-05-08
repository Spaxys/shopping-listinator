import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/TranscribedTextBox.styles';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onAccept: () => void;
  onClear: () => void;
};

export default function TranscribedTextBox({ value, onChange, onAccept, onClear }: Props) {
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
        <TouchableOpacity onPress={onClear} disabled={!value.trim()}>
          <MaterialIcons name="delete" size={32} color={value.trim() ? 'red' : '#ccc'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onAccept} disabled={!value.trim()}>
          <MaterialIcons name="check-circle" size={32} color={value.trim() ? 'green' : '#ccc'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}