import { StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import DevelopingAnimation from '@/views/animation/DevelopingAnimation';
import ViewContainer from '@/components/errorBoundary/ViewContainer';

const PcLogScreen = () => (
  <ViewContainer>
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <DevelopingAnimation autoPlay={true} />
    </View>
  </ViewContainer>
);

export default PcLogScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
