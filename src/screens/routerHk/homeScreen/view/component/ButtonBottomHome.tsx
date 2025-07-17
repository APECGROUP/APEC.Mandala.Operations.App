import { StyleSheet, View } from 'react-native';
import React from 'react';

// Imports từ ViewModel (đảm bảo đường dẫn chính xác)
import { useHomeViewModal } from '../../viewmodal/useHomeViewModal';

// Imports từ theme và elements
import { Colors } from '@/theme/Config';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import { PaddingHorizontal } from '@/utils/Constans';
import { vs, s } from 'react-native-size-matters';

// Component ButtonBottomHome hiển thị nhóm các nút chức năng ở cuối màn hình
const ButtonBottomHome = () => {
  // Lấy các hàm xử lý sự kiện từ ViewModel
  const { onPressMinibar, onPressCo, onPressBroken, onPressLost } = useHomeViewModal();

  return (
    <View style={styles.container}>
      {/* Nút "Chờ CO" */}
      <AppBlockButton onPress={onPressCo} style={styles.button}>
        <AppText numberOfLines={1} size={12} weight="600" color={Colors.WHITE}>
          Chờ CO
        </AppText>
      </AppBlockButton>

      {/* Đường phân cách */}
      <View style={styles.divider} />

      {/* Nút "Minibar" */}
      <AppBlockButton onPress={onPressMinibar} style={styles.button}>
        <AppText numberOfLines={1} size={12} weight="600" color={Colors.WHITE}>
          Minibar
        </AppText>
      </AppBlockButton>

      {/* Đường phân cách */}
      <View style={styles.divider} />

      {/* Nút "Đổ vỡ" */}
      <AppBlockButton onPress={onPressBroken} style={styles.button}>
        <AppText numberOfLines={1} size={12} weight="600" color={Colors.WHITE}>
          Đổ vỡ
        </AppText>
      </AppBlockButton>

      {/* Đường phân cách */}
      <View style={styles.divider} />

      {/* Nút "Thất lạc" */}
      <AppBlockButton onPress={onPressLost} style={styles.button}>
        <AppText numberOfLines={1} size={12} weight="600" color={Colors.WHITE}>
          Thất lạc
        </AppText>
      </AppBlockButton>

      {/* Đường phân cách cuối cùng (nếu muốn) */}
      <View style={styles.divider} />
    </View>
  );
};

export default ButtonBottomHome;

// Định nghĩa các style cho component
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY, // Sử dụng Colors.PRIMARY
    borderRadius: 1000,
    position: 'absolute',
    bottom: vs(19),
    alignSelf: 'center',
    width: s(316),
    height: vs(36),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PaddingHorizontal,
    height: vs(36),
  },
  divider: {
    width: 1,
    height: vs(18),
    backgroundColor: Colors.WHITE, // Sử dụng Colors.WHITE
  },
});
