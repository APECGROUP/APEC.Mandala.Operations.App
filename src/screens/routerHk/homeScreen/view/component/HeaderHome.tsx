import { StyleSheet, View } from 'react-native';
import React from 'react';
import { s, vs } from 'react-native-size-matters';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import { PaddingHorizontal } from '@/utils/Constans';
import IconBuilding from '@assets/icon/IconBuilding';
import IconDropDown from '@assets/icon/IconDropDown';
import IconLocalHk from '@assets/icon/IconLocalHk';
import IconNoteHk from '@assets/icon/IconNoteHk';
import IconNotificationHk from '@assets/icon/IconNotificationHk';
import FastImage from 'react-native-fast-image';
import { Colors } from '@/theme/Config';
import { useHomeViewModal } from '../../viewmodal/useHomeViewModal';

const HeaderHome = () => {
  const { infoUser } = useInfoUser();
  const { onPressBuilding, onPressLocation, onPressAll, onPressPriority, isAll } =
    useHomeViewModal();
  return (
    <View>
      {/* Header Section */}
      <View style={styles.header}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <FastImage
              source={{ uri: infoUser?.profile.avatar }}
              style={styles.avatar}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View style={styles.greetingContainer}>
            <AppText color={Colors.TEXT_NEUTRAL}>Xin chào,</AppText>
            <AppText color={Colors.TEXT_DEFAULT} size={16} weight="600">
              {infoUser?.profile.fullName}
            </AppText>
          </View>
        </View>

        {/* Notification Icons */}
        <View style={styles.iconGroup}>
          <AppBlockButton style={styles.iconButton}>
            <IconNotificationHk />
          </AppBlockButton>
          <AppBlockButton style={styles.iconButton}>
            <IconNoteHk />
          </AppBlockButton>
        </View>
      </View>
      {/* Filter Section */}
      <View style={styles.filterSection}>
        {/* Left Group: Building Filter, Space, Location Filter, Separator */}
        <View style={styles.leftFilterGroup}>
          {/* Building Filter */}
          <AppBlockButton onPress={onPressBuilding} style={styles.filterButton}>
            <View style={styles.filterContent}>
              <IconBuilding />
              <AppText style={styles.filterText}>D</AppText>
              <IconDropDown width={s(16)} />
            </View>
          </AppBlockButton>
          {/* Space between filters */}
          <View style={{ width: s(16) }} /> {/* Explicit spacing */}
          {/* Location Filter */}
          <AppBlockButton onPress={onPressLocation} style={styles.filterButton}>
            <View style={styles.filterContent}>
              <IconLocalHk />
              <AppText style={[styles.filterText, styles.filterTextMinwidth]}>Chọn</AppText>
              <IconDropDown width={s(16)} />
            </View>
          </AppBlockButton>
          {/* Separator */}
          <View style={styles.separator} />
        </View>

        {/* Right Group: "Tất cả" and "Ưu tiên" buttons */}
        <View style={styles.actionButtonGroup}>
          {/* "Tất cả" Button */}
          <AppBlockButton onPress={onPressAll} style={styles.actionButton}>
            <View
              style={[
                styles.actionButtonInner,
                isAll ? styles.actionButtonPrimary : styles.actionButtonSecondary,
              ]}>
              <AppText color={isAll ? Colors.WHITE : Colors.TEXT_DEFAULT}>Tất cả</AppText>
            </View>
          </AppBlockButton>

          {/* "Ưu tiên" Button */}
          <AppBlockButton onPress={onPressPriority} style={styles.actionButton}>
            <View
              style={[
                styles.actionButtonInner,
                !isAll ? styles.actionButtonPrimary : styles.actionButtonSecondary,
              ]}>
              <AppText color={!isAll ? Colors.WHITE : Colors.TEXT_DEFAULT}>Ưu tiên</AppText>
            </View>
          </AppBlockButton>
        </View>
      </View>
    </View>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  avatarContainer: {
    borderWidth: 1,
    borderColor: Colors.WHITE,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  avatar: {
    width: s(44),
    height: s(44),
    borderRadius: 100,
  },
  greetingContainer: {
    height: s(44),
    justifyContent: 'space-between',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: s(8),
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // <-- KEY CHANGE: Distribute space between left and right groups
    paddingHorizontal: PaddingHorizontal, // Apply padding equally on both sides
    // backgroundColor: 'red',
  },
  leftFilterGroup: {
    // New group for left elements
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: vs(18),
  },
  filterContent: {
    paddingVertical: vs(7),
    paddingHorizontal: s(4),
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    marginHorizontal: s(8),
    fontWeight: '600',
  },
  filterTextMinwidth: {
    minWidth: s(52),
  },
  separator: {
    width: 1,
    height: vs(24),
    backgroundColor: '#CACACA',
    marginLeft: s(16),
    marginRight: s(8),
    // marginHorizontal: s(8),
  },
  actionButtonGroup: {
    flexDirection: 'row',
    // Removed marginLeft: 'auto' as justifyContent: 'space-between' handles spacing
  },
  actionButton: {
    paddingVertical: vs(18),
    paddingHorizontal: s(5),
  },
  actionButtonInner: {
    paddingVertical: vs(7),
    paddingHorizontal: s(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.PRIMARY,
  },
  actionButtonSecondary: {
    backgroundColor: '#E8E8E8',
  },
});
