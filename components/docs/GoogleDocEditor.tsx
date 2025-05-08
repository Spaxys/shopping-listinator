import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function GoogleDocEditor() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Doc Editor</Text>
      <TouchableOpacity
        style={[styles.title, { backgroundColor: '#eee', padding: 8, borderRadius: 8 }]}
        onPress={() => router.back()}
      >
        <Text>Back to Speech To Text</Text>
      </TouchableOpacity>
      {/* UI for loading, editing, and saving a Google Doc will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});