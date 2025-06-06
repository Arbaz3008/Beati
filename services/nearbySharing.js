import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

export const shareSong = async (song) => {
  try {
    // 1. Request Permissions (Android needs WRITE_EXTERNAL_STORAGE)
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Storage permission required to share files');
    }

    // 2. Check sharing availability
    if (!(await Sharing.isAvailableAsync())) {
      throw new Error('Sharing not available on this device');
    }

    // 3. Create safe filename
    const safeFileName = song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileExtension = song.uri.split('.').pop() || 'mp3';
    const localUri = `${FileSystem.cacheDirectory}${safeFileName}.${fileExtension}`;

    // 4. Download file (with permission check)
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      const downloadResult = await FileSystem.downloadAsync(song.uri, localUri);
      if (downloadResult.status !== 200) {
        throw new Error(`Download failed: HTTP ${downloadResult.status}`);
      }
    }

    // 5. Share the file
    await Sharing.shareAsync(localUri, {
      mimeType: getMimeType(fileExtension),
      dialogTitle: `Share: ${song.title}`,
      UTI: Platform.OS === 'ios' ? 'public.audio' : undefined,
    });

    return { success: true, filePath: localUri };
  } catch (error) {
    console.error('Sharing error:', error);
    Alert.alert('Sharing Failed', error.message);
    throw error;
  }
};