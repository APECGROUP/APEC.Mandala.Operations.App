import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNameScreen} from '../../zustand/store/useNameScreen/useNameScreen';
import light from '../../theme/light';
import {AppText} from '../../elements/text/AppText';
import Clipboard from '@react-native-clipboard/clipboard';

const NameScreen = () => {
  const {top} = useSafeAreaInsets();
  const {nameScreen} = useNameScreen();
  const onCopy = () => {
    Clipboard.setString(nameScreen);
  };
  if (!nameScreen) {
    return;
  }
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onCopy}
      style={[styles.root, {top: top - 10}]}>
      <AppText style={{color: light.white}}>{nameScreen}</AppText>
    </TouchableOpacity>
  );
};

export default NameScreen;

const styles = StyleSheet.create({
  root: {
    right: 16,
    position: 'absolute',
    backgroundColor: '#00000080',
    paddingHorizontal: 10,
    paddingVertical: 2,
    zIndex: 9999999,
  },
});
