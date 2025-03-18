import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Report: { imageUri: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function Nav() {
  const navigation = useNavigation<NavigationProp>();

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      
      // Send image to terminal
      try {
        const base64Image = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
        console.log('Image data (base64):', base64Image);
      } catch (error) {
        console.error('Error reading image:', error);
      }

      navigation.navigate('Report', { imageUri });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="home" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.scannerButton} onPress={handleImageUpload}>
        <Ionicons name="scan-sharp" size={32} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="person-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(116, 108, 108, 0.43)',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    padding: 10,
  },
  scannerButton: {
    backgroundColor: '#90C3F9',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

