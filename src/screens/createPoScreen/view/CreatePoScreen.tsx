import { StyleSheet, View } from 'react-native';
import React from 'react';
import DevelopingAnimation from '@/views/animation/DevelopingAnimation';

const CreatePoScreen = () => (
  <View style={styles.container}>
    <DevelopingAnimation autoPlay={true} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePoScreen;
