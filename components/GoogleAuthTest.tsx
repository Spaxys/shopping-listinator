import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export function GoogleAuthTest() {
  const [authStatus, setAuthStatus] = React.useState<string>('');

  const testSignIn = async () => {
    try {
      const hasPlay = await GoogleSignin.hasPlayServices();
      setAuthStatus(`Play Services: ${hasPlay ? 'Available' : 'Not Available'}`);
      
      const isSignedIn = await GoogleSignin.isSignedIn();
      setAuthStatus(prev => `${prev}\nSigned In: ${isSignedIn}`);
      
      const userInfo = await GoogleSignin.signIn();
      setAuthStatus(prev => `${prev}\nSuccess: ${userInfo.user.email}`);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setAuthStatus('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setAuthStatus('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setAuthStatus('Play services not available');
      } else {
        setAuthStatus(`Error: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={testSignIn}>
        <Text style={styles.buttonText}>Test Google Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.status}>{authStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  status: {
    marginTop: 20,
    color: '#666',
  },
});