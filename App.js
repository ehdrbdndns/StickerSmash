import { useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import domtoimage from 'dom-to-image';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  const [selectedImage, setSelectedImage] = useState('');
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1
    });

    if (result.canceled) {
      alert('you did not select image')
    } else {
      setShowAppOptions(true);
      setSelectedImage(result.assets[0].uri);
    }
  }

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage('');
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onSaveImageAsync = async () => {
    try {
      console.log(Platform.OS);
      if (Platform.OS === 'web') {
        const dataUri = await domtoimage.toJpeg(imageRef.current, {
          quality: 1, width: 320, height: 440
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpg';
        link.href = dataUri;
        link.click();
      }
      else {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1
        });

        if (!localUri) {
          alert('Failed to save image');
          return;
        }

        await MediaLibrary.saveToLibraryAsync(localUri);

        if (localUri) {
          alert('Image saved successfully');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer placeholderImage={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {showAppOptions
        ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label={"reset"} onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon="save-alt" label={"save"} onPress={onSaveImageAsync} />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button theme={'primary'} label={"Choose a photo"} onPress={pickImageAsync}></Button>
            <Button label={"Use this photo"} onPress={() => setShowAppOptions(true)}></Button>
          </View>
        )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}></EmojiList>
      </EmojiPicker>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center'
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    flexDirection: 'row',
    alignContent: 'center'
  }
});
