import { LayoutAnimation, StyleSheet, View } from 'react-native';
import React, { useCallback, useState } from 'react';

// Imports từ modal và enums (đảm bảo đường dẫn chính xác)
import {
  CleaningStatus,
  FloorData,
  GuestStatus,
  LockStatus,
  RoomData,
} from '../../modal/HomeModal';

// Imports từ elements và theme
import AppBlockButton from '@/elements/button/AppBlockButton';
// import { Colors } from '@/theme/Config'; // KHÔNG SỬ DỤNG Colors từ Config nữa
import { vs } from 'react-native-size-matters';
import { AppText } from '@/elements/text/AppText';
import { PaddingHorizontal } from '@/utils/Constans';

// Imports icon (đảm bảo đường dẫn chính xác)
import IconDropDown from '@assets/icon/IconDropDown';
import IconCheckIn from '@assets/icon/IconCheckIn';
import IconClear from '@assets/icon/IconClear';
import IconCheckOut from '@assets/icon/IconCheckOut';
import IconCheckInAndCheckOut from '@assets/icon/IconCheckInAndCheckOut';
import IconFlag from '@assets/icon/IconFlag';
import IconLock from '@assets/icon/IconLock';

// Imports từ thư viện FlashList
import { FlashList } from '@shopify/flash-list';

// Import ViewModel (đảm bảo đường dẫn chính xác)
import { useHomeViewModal } from '../../viewmodal/useHomeViewModal';
import { Colors } from '@/theme/Config';

// --- Component con: RoomCard ---
// Chịu trách nhiệm render một thẻ phòng duy nhất
interface RoomCardProps {
  room: RoomData;
  isSelected: boolean;
  onPress: (room: RoomData) => void;
}

const RoomCard: React.FC<RoomCardProps> = React.memo(({ room, isSelected, onPress }) => {
  // Logic xác định màu fill cho các biểu tượng dựa trên trạng thái dọn phòng
  const getFillColor = () => {
    switch (room.cleaningStatus) {
      case CleaningStatus.Clean:
        return '#1D7AFC'; // Giữ nguyên màu hardcode
      case CleaningStatus.Inspected:
        return '#44921F'; // Giữ nguyên màu hardcode
      case CleaningStatus.Pickup:
        return '#FDB229'; // Giữ nguyên màu hardcode
      case CleaningStatus.Dirty:
        return '#D8070B'; // Giữ nguyên màu hardcode
      case CleaningStatus.None:
        return '#1D7AFC'; // Giữ nguyên màu hardcode
      default:
        return '#1D7AFC'; // Giữ nguyên màu hardcode
    }
  };

  // Logic xác định biểu tượng chính dựa trên trạng thái khách hoặc khóa
  const getMainIcon = () => {
    if (room.lockStatus === LockStatus.Locked) {
      return <IconLock />;
    }
    switch (room.guestStatus) {
      case GuestStatus.CheckIn:
        return <IconCheckIn />;
      case GuestStatus.CheckOut:
        return <IconCheckOut />;
      case GuestStatus.CheckOutAndCheckIn:
        return <IconCheckInAndCheckOut />;
      default:
        return <IconCheckIn />; // Biểu tượng mặc định nếu không có trạng thái khách cụ thể
    }
  };

  const fillColor = getFillColor();

  return (
    <AppBlockButton
      onPress={() => onPress(room)}
      style={[
        styles.roomCardContainer,
        // eslint-disable-next-line react-native/no-inline-styles
        isSelected ? { borderColor: '#FDB229' } : { borderColor: Colors.TRANSPARENT },
      ]}>
      <AppText weight="600" color={fillColor}>
        {room.roomNumber}
      </AppText>
      <AppText weight="600" size={11} color="#8F8F8F">
        {room.numberOfGuests}
      </AppText>
      <View style={styles.roomCardDivider} />
      <View style={styles.roomCardIconSection}>
        <View style={styles.roomCardIconWrapper}>{getMainIcon()}</View>
        <View style={styles.roomCardIconDivider} />
        <View style={styles.roomCardIconWrapper}>
          <IconClear fill={fillColor} />
        </View>
      </View>
      {room.isFlag && <IconFlag style={styles.roomCardFlagIcon} />}
    </AppBlockButton>
  );
});

// --- Component chính: ItemHome ---
// Chịu trách nhiệm hiển thị một tầng và FlashList các phòng của nó
const ItemHome = ({ item, index }: { item: FloorData; index: number }) => {
  const [isOpen, setIsOpen] = useState(index === 0 ? true : false);
  const { selectedRoom, setSelectedRoom } = useHomeViewModal();

  const onToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Bật animation
    setIsOpen(prev => !prev);
  };

  const renderRoomItem = useCallback(
    ({ item: roomItem }: { item: RoomData }) => {
      const isSelected = selectedRoom?.id === roomItem.id;
      return <RoomCard room={roomItem} isSelected={isSelected} onPress={setSelectedRoom} />;
    },
    [selectedRoom?.id, setSelectedRoom], // Dependencies: chỉ render lại khi selectedRoom thay đổi
  );

  return (
    <View style={styles.floorContainer}>
      <AppBlockButton onPress={onToggle} style={styles.floorToggleButton}>
        <AppText size={14} weight="600">
          {item.floorName}
        </AppText>
        <IconDropDown style={isOpen ? null : styles.rotatedIcon} />
      </AppBlockButton>

      {isOpen && (
        <FlashList
          numColumns={3}
          data={item.rooms}
          renderItem={renderRoomItem}
          keyExtractor={roomItem => roomItem.id}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          scrollEnabled={false}
          contentContainerStyle={styles.roomListContent}
        />
      )}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // Styles cho RoomCard
  roomCardContainer: {
    backgroundColor: Colors.WHITE,

    flex: 1,
    marginHorizontal: PaddingHorizontal / 2,
    marginBottom: vs(16),
    borderRadius: 8,
    paddingVertical: vs(12),
    borderWidth: 1,
    borderColor: Colors.TRANSPARENT,
    shadowColor: '#000', // Giữ nguyên màu hardcode
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomCardDivider: {
    height: 0.3,
    width: '100%',
    backgroundColor: '#E0E0E0', // Giữ nguyên màu hardcode
    marginTop: vs(4),
  },
  roomCardIconSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
  },
  roomCardIconWrapper: {
    paddingVertical: vs(8),
    width: '50%',
    alignItems: 'center',
  },
  roomCardIconDivider: {
    height: vs(20),
    width: 0.5,
    backgroundColor: '#E0E0E0', // Giữ nguyên màu hardcode
  },
  roomCardFlagIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  // Styles cho ItemHome (phần tầng)
  floorContainer: {
    // Không cần style cụ thể ở đây nếu không có container lớn hơn
  },
  floorToggleButton: {
    backgroundColor: '#FFFFFF', // Giữ nguyên màu hardcode
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: PaddingHorizontal,
    borderWidth: 0.3,
    borderColor: '#E0E0E0', // Giữ nguyên màu hardcode
  },
  rotatedIcon: {
    transform: [{ rotate: '180deg' }],
  },
  roomListContent: {
    paddingHorizontal: PaddingHorizontal / 2,
    paddingTop: vs(16),
  },
});

export default ItemHome;
