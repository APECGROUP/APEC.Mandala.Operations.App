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
import {useTranslation} from 'react-i18next';
import {Colors} from '@/theme/Config';
const ICON_SECTION_WIDTH = s(130);

interface HeaderProps {
  title?: string;
  rightComponent?: React.ReactNode;
  primary?: boolean;
  iconWidth?: number;
}

const Header = ({
  title = '',
  rightComponent,
  primary = false,
  iconWidth = s(40),
}: HeaderProps) => {
  const {top} = useSafeAreaInsets();
  const {t} = useTranslation();
  return (
    <View
      style={[
        styles.container,
        {paddingTop: top},
        primary && {backgroundColor: Colors.PRIMARY},
      ]}>
      <AppBlockButton
        onPress={goBack}
        style={[styles.buttonBack, {width: iconWidth}]}>
        <IconBack color={primary ? Colors.WHITE : Colors.BLACK_900} />
      </AppBlockButton>

      <AppText style={[styles.title, primary && {color: Colors.WHITE}]}>
        {title || t('Thông báo')}
      </AppText>
      <View style={{width: iconWidth}}>{rightComponent}</View>
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
    paddingLeft: PaddingHorizontal,
    height: vs(40),
    justifyContent: 'center',
  },
});

export default Header;
