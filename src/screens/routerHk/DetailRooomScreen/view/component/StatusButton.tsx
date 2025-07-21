import { TouchableOpacity } from 'react-native';
import React from 'react';
import { AppText } from '@/elements/text/AppText';
import { s } from 'react-native-size-matters';
import IconCheck from '@assets/icon/IconCheck';
import { styles } from './styles';
import { RoomStatus } from './constants';
import { Colors } from '@/theme/Config';

interface StatusButtonProps {
  item: RoomStatus;
  isSelected: boolean;
  onPress: () => void;
}

export const StatusButton: React.FC<StatusButtonProps> = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.statusButton,
      // eslint-disable-next-line react-native/no-inline-styles
      {
        backgroundColor: item.backgroundColor,
        borderWidth: 1,
        borderColor: item.color,
      },
      // eslint-disable-next-line react-native/no-inline-styles
      isSelected && {
        backgroundColor: item.color,
        borderColor: item.color,
        flexDirection: 'row',
        alignItems: 'center',
      },
    ]}>
    {isSelected && <IconCheck style={{ marginRight: s(2) }} />}
    <AppText
      style={[styles.statusText, { color: item.color }, isSelected && { color: Colors.WHITE }]}>
      {item.name}
    </AppText>
  </TouchableOpacity>
);
