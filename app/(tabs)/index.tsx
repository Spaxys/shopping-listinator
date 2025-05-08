import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import SpeechToText from '../../components/SpeechToText';
// Example: Request microphone permission using expo-av
import { Audio } from 'expo-av';
import { useEffect } from 'react';
import {
  ExpoSpeechRecognitionModule,
} from "expo-speech-recognition";
import { Link } from 'expo-router';


export default function IndexPage() {
  useEffect(() => {
  (async () => {
    const { status } = await Audio.requestPermissionsAsync();
    const speechReckPermResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (status !== 'granted' || !speechReckPermResult.granted) {
      alert('Microphone and Speech Recognition permissions are required!');
    } else {
      console.log("Permissions granted for both Audio and Speech Recognition.");
    }
  })();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.debugText}>Debug: App is running</Text>
      <SpeechToText />
      <Link href="/docs">
        <Text>Go to Docs</Text>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  debugText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});