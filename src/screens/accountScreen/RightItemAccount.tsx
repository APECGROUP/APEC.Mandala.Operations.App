import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { useOtaUpdate } from '@/hook/useOtaUpdate';
import { Colors } from '@/theme/Config';
import { AppText } from '@/elements/text/AppText';

const RightItemAccount = ({ item }: { item: any }) => {
  const { loading, progress } = useOtaUpdate();
  if (loading) {
    return <ActivityIndicator size="small" color={Colors.PRIMARY} />;
  }
  if (progress !== 0 && progress !== 100) {
    return <AppText>{progress}%</AppText>;
  }
  return <View style={styles.row}>{item.right}</View>;
};

export default RightItemAccount;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
