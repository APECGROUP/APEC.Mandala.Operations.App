import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainParams} from '../../../../navigation/params';
import ImageView from 'react-native-image-viewing';

const ImageViewScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainParams, 'ImageViewScreen'>) => {
  const {images, imageIndex} = route.params;
  return (
    <View>
      <ImageView
        images={images}
        imageIndex={imageIndex}
        visible={true}
        onRequestClose={() => navigation.goBack()}
      />
    </View>
  );
};

export default ImageViewScreen;

const styles = StyleSheet.create({});
