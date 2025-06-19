import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import DevelopingAnimation from '@/views/animation/DevelopingAnimation';

const PcLogScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DevelopingAnimation autoPlay={true} />
    </View>
  );
};

export default PcLogScreen;

const styles = StyleSheet.create({});
