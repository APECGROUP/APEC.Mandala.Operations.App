import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/elements/text/AppText';
import { s, vs } from 'react-native-size-matters';
import { PaddingHorizontal } from '@/utils/Constans';

interface RoomInfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

const RoomInfoRow: React.FC<RoomInfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowItem}>
      {icon}
      <AppText style={{ marginLeft: s(12) }}>{label}</AppText>
    </View>
    {typeof value === 'string' ? <AppText weight="600">{value}</AppText> : value}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: PaddingHorizontal,
    paddingVertical: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RoomInfoRow;
