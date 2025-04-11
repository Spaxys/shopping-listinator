import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import SpeechToText from './components/SpeechToText';
import { registerRootComponent} from 'expo';
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.debugText}>Debug: App is running</Text>
      <SpeechToText />
    </SafeAreaView>
  );
}
registerRootComponent(App);

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