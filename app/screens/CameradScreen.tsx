import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraView, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import Button from '../Components/Button';
import { ThemedText } from '../Components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Entypo } from '@expo/vector-icons';
import Slider from '@react-native-community/slider'; 

type RootStackParamList = {
  CameraScreen: undefined;
  DisplayScreen: { imageUri: string };
};

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CameraScreen'>;

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [zoom, setZoom] = useState(0);
  const [showZoomSlider, setShowZoomSlider] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Picture saved! 🎉');
        setImage(null);
        navigation.navigate('DisplayScreen', { imageUri: image });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const openMediaLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setImage(pickerResult.assets[0].uri);
        navigation.navigate('DisplayScreen', { imageUri: pickerResult.assets[0].uri });
      }
    } else {
      alert('Permission to access camera roll is required!');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleCameraFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const toggleZoomSlider = () => {
    setShowZoomSlider(prev => !prev);
  };

  if (hasCameraPermission === false) {
    return <ThemedText>No access to camera</ThemedText>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <CameraView 
          style={styles.camera}
          facing={facing}
          flash={flash}
          zoom={zoom}
          ref={cameraRef}
        >
          <View style={styles.overlay} />
          <View style={styles.topButtons}>
            <Button icon={'retweet'} title={undefined} onPress={toggleCameraFacing} color={'#fff'} />
            <Button icon={'flash'} title={undefined} onPress={toggleCameraFlash} color={'#fff'} />
          </View>
        </CameraView>
      ) : (
        <Image source={{ uri: image }} style={styles.capturedImage} />
      )}
      <View style={styles.buttonContainer}>
        {image ? (
          <View style={styles.actionButtons}>
            <Button title={"Re-Take"} icon="retweet" onPress={() => setImage(null)} color={'#f1c40f'} />
            <Button title={"Save"} icon="check" onPress={saveImage} color={'#166534'} />
          </View>
        ) : (
          <View style={styles.captureContainer}>
            <TouchableOpacity onPress={openMediaLibrary} style={styles.libraryButton}>
              <Entypo name="images" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <Entypo name="camera" size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleZoomSlider} style={styles.zoomButton}>
              <Entypo name="picasa" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {showZoomSlider && (
        <View style={styles.zoomContainer}>
          <Slider
            style={styles.zoomSlider}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={zoom}
            onValueChange={setZoom}
            thumbTintColor="#166534"
            minimumTrackTintColor="#166534"
            maximumTrackTintColor="#ffffff"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  capturedImage: {
    height: '80%', 
    width: '100%',
    position: 'absolute',
    top: '10%',
    borderRadius: 10, 
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 40, 
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20, 
    position: 'absolute',
    top: 10, 
    width: '100%',
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  captureButton: {
    backgroundColor: '#1B5E20',
    borderRadius: 50,
    height: 75,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  libraryButton: {
    marginRight: 25,
  },
  zoomButton: {
    marginLeft: 25,
  },
  zoomContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 120, 
  },
  zoomSlider: {
    width: 220, 
    marginBottom: 25,
  },
});
