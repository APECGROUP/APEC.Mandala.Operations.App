import { StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import EmptyDataAnimation from '@/views/animation/EmptyDataAnimation';
import ConfettiAnimation from '@/views/animation/Confetti';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants';
import ViewContainer from '@/components/errorBoundary/ViewContainer';

const PcPrScreen = () => (
  <ViewContainer>
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <ConfettiAnimation style={styles.confetti} autoPlay={true} />
      <EmptyDataAnimation autoPlay={true} />
    </View>
  </ViewContainer>
);

export default PcPrScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
