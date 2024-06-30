import {Image, StyleSheet} from 'react-native'

export default function ImageViewer({placeholderImage, selectedImage}) {
  const imageSource = selectedImage ? {uri: selectedImage} : placeholderImage;
  
  return (
    <Image style={styles.image} source={imageSource} />
  )
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18
  }
})