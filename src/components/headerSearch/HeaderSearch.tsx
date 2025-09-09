import { ImageBackground, StatusBar, StyleSheet, TextInput, View } from 'react-native';
import React, { memo, useCallback, useEffect } from 'react';
import Images from '@assets/image/Images';
import FastImage from 'react-native-fast-image';
import { getFontSize, SCREEN_WIDTH } from '../../constants';
import IconSearch from '@assets/icon/IconSearch';
import { s, vs } from 'react-native-size-matters';
import AppBlockButton from '../../elements/button/AppBlockButton';
import IconFilter from '@assets/icon/IconFillter';
import { PaddingHorizontal } from '../../utils/Constans';
import { Colors } from '../../theme/Config';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../elements/text/AppText';
import IconNotification from '@assets/icon/IconNotification';
import { useInfoUser } from '../../zustand/store/useInfoUser/useInfoUser';
import { navigate } from '../../navigation/RootNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatNotificationCount } from '@/screens/notificationScreen/view/NotificationScreen';
import { useTotalNotificationNoRead } from '@/zustand/store/useTotalNotificationNoRead/useTotalNotificationNoRead';
type propsHeaderSearch = {
  currentPrNoInput: string;
  onSearch: (text: string) => void;
  textPlaceholder?: string;
  goToFilterScreen: () => void;
};
const HeaderSearch = ({
  currentPrNoInput,
  onSearch,
  textPlaceholder,
  goToFilterScreen,
}: propsHeaderSearch) => {
  const { t } = useTranslation();
  const { infoUser } = useInfoUser();
  const { top } = useSafeAreaInsets();
  const { fetData, totalNotification } = useTotalNotificationNoRead();
  // const { totalNotification } = useNotificationViewModel();
  const goToAccount = useCallback(() => navigate('AccountScreen'), []);
  const goToNotification = useCallback(() => navigate('NotificationScreen'), []);
  useEffect(() => {
    fetData();
  }, [fetData]);

  return (
    <ImageBackground
      source={Images.BackgroundAssignPrice}
      resizeMode={FastImage.resizeMode.cover}
      style={styles.containerHeader}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.PRIMARY}
        // backgroundColor="transparent" // Thường đặt transparent nếu có ảnh nền
        // translucent // Giúp nội dung tràn ra phía sau StatusBar
      />
      <View style={[styles.headerContainer, { marginTop: top || vs(20) }]}>
        <View style={styles.headerLeft}>
          <AppBlockButton onPress={goToAccount}>
            <FastImage source={{ uri: infoUser?.avatar }} style={styles.avatar} />
          </AppBlockButton>

          <View style={styles.greetingContainer}>
            <AppText color="#FFFFFF" style={styles.greetingText}>
              {t('createPrice.title')}! - {infoUser?.userName}
            </AppText>
            <AppText weight="700" color="#FFFFFF" style={styles.greetingText} numberOfLines={1}>
              {infoUser?.hotelName}
            </AppText>
          </View>
        </View>
        <View style={styles.headerRight}>
          <AppBlockButton onPress={goToNotification} style={styles.notificationWrapper}>
            <IconNotification />
            {totalNotification > 0 && (
              <View style={styles.notificationBadge}>
                <AppText style={styles.notificationBadgeText}>
                  {formatNotificationCount(totalNotification)}
                </AppText>
              </View>
            )}
          </AppBlockButton>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <IconSearch width={vs(18)} />
        <TextInput
          value={currentPrNoInput} // Lấy giá trị từ ViewModel để đồng bộ UI với debounce
          onChangeText={onSearch} // Gọi hàm debounce từ ViewModel
          placeholder={textPlaceholder || t('assignPrice.searchPlaceholder')}
          placeholderTextColor={Colors.TEXT_SECONDARY}
          style={styles.searchInput}
          // returnKeyType="search"
          // onSubmitEditing={goToFilterScreen} // Submit Search hoặc đi tới FilterScreen
        />
        <AppBlockButton style={styles.filterButton} onPress={goToFilterScreen}>
          <IconFilter />
        </AppBlockButton>
      </View>
    </ImageBackground>
  );
};

export default memo(HeaderSearch);

const styles = StyleSheet.create({
  containerHeader: {
    width: SCREEN_WIDTH,
    aspectRatio: 2.66,
  },
  greetingText: {
    fontSize: getFontSize(18),
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: getFontSize(7),
    fontWeight: '500',
  },
  notificationBadge: {
    borderWidth: 0.5,
    borderColor: Colors.WHITE,
    position: 'absolute',
    top: vs(2),
    right: s(0),
    backgroundColor: '#FF3B30',
    width: vs(16),
    height: vs(16),
    borderRadius: vs(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1,
    borderColor: Colors.WHITE,
    height: vs(40),
    aspectRatio: 1,
    borderRadius: vs(20),
    marginRight: s(8),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationWrapper: {
    width: vs(32),
    height: vs(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    height: vs(40),
    justifyContent: 'center',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: vs(12),

    // alignItems: 'flex-start',
    // alignItems: 'center',
    paddingHorizontal: PaddingHorizontal,
    // backgroundColor: 'red',

    flex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    marginBottom: vs(-14),
    backgroundColor: Colors.WHITE,
    borderRadius: s(8),
    paddingLeft: s(12),
    height: vs(46),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  filterButton: {
    borderLeftWidth: 0.3,
    borderLeftColor: '#BABABA',
    height: vs(46),
    width: vs(46),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(12),
    fontWeight: '500',
    paddingVertical: 0,
    paddingLeft: s(6),
  },
});
