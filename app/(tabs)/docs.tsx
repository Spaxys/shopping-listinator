import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { GoogleDriveService } from '@/services/GoogleDriveService';
import { GoogleAuthTest } from '@/components/GoogleAuthTest';

export default function DocsScreen() {
  const { accessToken, isLoading, error, signIn, pickDocument } = useGoogleAuth();
  
  const handleCreateDocument = async () => {
    if (!accessToken) {
      const token = await signIn();
      if (!token) return;
    }
    
    const driveService = new GoogleDriveService(accessToken!);
    try {
      const newDoc = await driveService.createDocument('My Shopping List');
      console.log('Created document:', newDoc);
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  const handleOpenDocument = async () => {
    if (!accessToken) {
      const token = await signIn();
      if (!token) return;
    }

    const doc = await pickDocument();
    if (doc) {
      const driveService = new GoogleDriveService(accessToken!);
      try {
        const docInfo = await driveService.editDocument(doc.id);
        console.log('Opened document:', docInfo);
      } catch (err) {
        console.error('Error opening document:', err);
      }
    }
  };

  const handleTestAuth = async () => {
    try {
      const token = await signIn();
      if (token) {
        console.log('Successfully authenticated!');
        console.log('Access token:', token.substring(0, 10) + '...');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={styles.container}>
      <Text style={styles.errorText}>Error: {error.message}</Text>
    </View>;
  }

  return (
    <View style={styles.container}>
      <GoogleAuthTest />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleTestAuth}
      >
        <Text style={styles.buttonText}>Test Google Sign In</Text>
      </TouchableOpacity>
      {accessToken && (
        <Text style={styles.successText}>✓ Successfully authenticated</Text>
      )}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCreateDocument}
      >
        <Text style={styles.buttonText}>Create New Document</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleOpenDocument}
      >
        <Text style={styles.buttonText}>Open Existing Document</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
    marginBottom: 10,
  },
});