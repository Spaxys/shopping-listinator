import { useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as DocumentPicker from 'expo-document-picker';

export function useGoogleAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  const initializeGoogleSignIn = async () => {
    try {
      GoogleSignin.configure({
        scopes: [
          'https://www.googleapis.com/auth/drive.file', // For file read/write access to specific files
        ],
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      setAccessToken(tokens.accessToken);
      return tokens.accessToken;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.google-apps.document',
        copyToCacheDirectory: false,
      });
      
      if (result.assets && result.assets.length > 0) {
        return result.assets[0];
      }
      return null;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  return { 
    accessToken, 
    isLoading, 
    error, 
    signIn, 
    pickDocument 
  };
}