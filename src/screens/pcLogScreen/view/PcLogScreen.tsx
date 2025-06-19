import { StyleSheet, View } from 'react-native';
import React from 'react';
import DevelopingAnimation from '@/views/animation/DevelopingAnimation';

const PcLogScreen = () => (
  <View style={styles.container}>
    <DevelopingAnimation autoPlay={true} />
  </View>
);

export default PcLogScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
