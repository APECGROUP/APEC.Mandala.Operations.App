import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppText} from '../../../../elements/text/AppText';
import {goBack} from '../../../../navigation/RootNavigation';
import IconSeeAll from '../../../../../assets/icon/IconSeeAll';
import IconBack from '../../../../../assets/icon/IconBack';
import {getFontSize, SCREEN_WIDTH} from '../../../../constants';
import {PaddingHorizontal} from '../../../../utils/Constans';
import AppBlockButton from '../../../../elements/button/AppBlockButton';
import light from '../../../../theme/light';
import {t} from 'i18next';

interface HeaderProps {
  onPressRight: () => void;
}

const ICON_SECTION_WIDTH = s(130);
const totalNotification = 100; // Hoặc truyền từ props nếu dynamic

const formatNotificationCount = (count: number) => {
  if (!count || count <= 0) return '';
  if (count > 99) return '99+';
  return count < 10 ? `0${count}` : `${count}`;
};

const Header = ({onPressRight}: HeaderProps) => {
  const {top} = useSafeAreaInsets();
  const notificationLabel = formatNotificationCount(totalNotification);

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <AppBlockButton onPress={goBack} style={styles.buttonBack}>
        <IconBack />
      </AppBlockButton>

      <AppText style={styles.title}>{t('Thông báo')}</AppText>

      <TouchableOpacity style={styles.rightButton} onPress={onPressRight}>
        <IconSeeAll />
        <AppText numberOfLines={1} style={styles.rightText}>
          {t('Đọc tất cả')}
          {notificationLabel ? ` (${notificationLabel})` : ''}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    backgroundColor: light.white,
    borderColor: '#E0E0E0',
  },
  title: {
    fontSize: vs(18),
    fontWeight: '700',
    color: light.text,
    flex: 1,
    textAlign: 'center',
  },
  rightButton: {
    width: ICON_SECTION_WIDTH,
    height: vs(40),
    flexDirection: 'row',
    paddingRight: PaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightText: {
    fontSize: getFontSize(12),
    marginLeft: s(4),
    fontWeight: '500',
    color: light.primary,
  },
  buttonBack: {
    width: ICON_SECTION_WIDTH,
    paddingLeft: PaddingHorizontal,
    height: vs(40),
    justifyContent: 'center',
  },
});

export default Header;
