import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../../../elements/text/AppText';
import { goBack } from '../../../../navigation/RootNavigation';
import IconBack from '../../../../../assets/icon/IconBack';
import { SCREEN_WIDTH } from '../../../../constants';
import { PaddingHorizontal } from '../../../../utils/Constans';
import AppBlockButton from '../../../../elements/button/AppBlockButton';
import light from '../../../../theme/light';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme/Config';

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
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <>
      <StatusBar
        barStyle={primary ? 'light-content' : 'dark-content'}
        backgroundColor={primary ? 'white' : 'black'}
      />
      <View
        style={[
          styles.container,
          { paddingTop: Math.max(top, vs(50)) },
          primary && { backgroundColor: Colors.PRIMARY },
        ]}>
        <AppBlockButton onPress={goBack} style={[styles.buttonBack, { width: iconWidth }]}>
          <IconBack color={primary ? Colors.WHITE : Colors.BLACK_900} />
        </AppBlockButton>

        <AppText style={[styles.title, primary && { color: Colors.WHITE }]}>
          {title || t('Thông báo')}
        </AppText>
        <View style={{ width: iconWidth }}>{rightComponent}</View>
      </View>
    </>
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
  buttonBack: {
    paddingLeft: PaddingHorizontal,
    height: vs(40),
    justifyContent: 'center',
  },
});

export default Header;
