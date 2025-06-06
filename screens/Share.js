import React, { useState ,useEffect} from 'react';
import { View, Button, Text, Platform, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

export default function ShareAudioScreen() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickFile = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true, // Changed to true for better sharing compatibility
      });
      
      if (result.type === 'success') {
        setFile(result);
      } else {
        Alert.alert('Cancelled', 'File selection was cancelled');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file: ' + error.message);
      console.error('File picking error:', error);
    } finally {
      setIsLoading(false);
    }
  };
// In your ShareScreen component
useEffect(() => {
  const checkPermissions = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Needed',
        'We need storage access to share files',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { 
            text: 'Allow', 
            onPress: async () => {
              await MediaLibrary.requestPermissionsAsync();
            } 
          },
        ]
      );
    }
  };
  checkPermissions();
}, []);
  const shareFile = async () => {
    if (!file) return;
    
    try {
      setIsLoading(true);
      
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this platform');
        return;
      }

      await Sharing.shareAsync(file.uri, {
        mimeType: file.mimeType || 'audio/*',
        dialogTitle: 'Share Audio File',
        UTI: 'public.audio' // iOS specific
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share file: ' + error.message);
      console.error('Sharing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Select Audio File" 
        onPress={pickFile} 
        disabled={isLoading}
      />
      
      {isLoading && <ActivityIndicator size="large" style={styles.loader} />}
      
      {file && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{file.name}</Text>
          <Text style={styles.fileSize}>
            {Platform.OS === 'ios' 
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB` 
              : ''}
          </Text>
        </View>
      )}
      
      <Button 
        title="Share File" 
        onPress={shareFile} 
        disabled={!file || isLoading}
        color={Platform.OS === 'ios' ? '#007AFF' : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fileInfo: {
    marginVertical: 20,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
  },
  loader: {
    marginVertical: 20,
  },
});