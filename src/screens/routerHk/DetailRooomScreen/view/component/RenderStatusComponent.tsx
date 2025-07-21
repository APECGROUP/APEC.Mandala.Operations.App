import { TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import { AppText } from '@/elements/text/AppText';
import { ROOM_STATUSES, RoomStatus } from './constants';
import { styles } from './styles';
import { StatusButton } from './StatusButton';
import useInformationRoomViewModal from '../../viewmodal/useInformationRoomViewModal';

const RenderStatusComponent = ({ id, onGoBack }: { id: string; onGoBack: () => void }) => {
  const { status, changeStatus } = useInformationRoomViewModal(id);
  const onPress = useCallback(
    async (item: RoomStatus) => {
      await onGoBack();
      changeStatus(item);
    },
    [changeStatus, onGoBack],
  );
  return (
    <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.section}>
      <AppText style={styles.sectionTitle}>THAY ĐỔI TRẠNG THÁI ĐƠN PHÒNG</AppText>

      <View style={styles.statusContainer}>
        {ROOM_STATUSES.map(item => (
          <StatusButton
            key={item.id}
            item={item}
            isSelected={item.id === status.id}
            onPress={() => onPress(item)}
            // onPress={() => changeStatus(item)}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default RenderStatusComponent;
