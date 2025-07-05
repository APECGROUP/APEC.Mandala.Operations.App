import { StatusBar, StyleSheet, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import DevelopingAnimation from '@/views/animation/DevelopingAnimation';
import SkeletonItem from '@/components/skeleton/SkeletonItem';
import { PaddingHorizontal } from '@/utils/Constans';

const CreatePoScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  useLayoutEffect(() => {
    StatusBar.setBarStyle('dark-content');
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);
  if (isLoading) {
    return (
      <View style={styles.containerLoading}>
        {new Array(6).fill(0).map((_, index) => (
          <SkeletonItem key={index} />
        ))}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'default'} />
      <DevelopingAnimation autoPlay={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PaddingHorizontal,
    marginTop: 100,
  },
});

export default CreatePoScreen;
