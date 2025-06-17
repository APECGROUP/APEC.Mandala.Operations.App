import React, {useState} from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {Colors} from '@/theme/Config';
import AppBlockButton from '@/elements/button/AppBlockButton';
import AppImage from '@/elements/appImage/AppImage';
import {useInfoUser} from '@/zustand/store/useInfoUser/useInfoUser';
import {s, vs} from 'react-native-size-matters';
import {AppText} from '@/elements/text/AppText';

import {useTranslation} from 'react-i18next';
import {useAlert} from '@/elements/alert/AlertProvider';
import DataLocal from '@/data/DataLocal';
import {navigate} from '@/navigation/RootNavigation';
import Animated, {FadeInDown} from 'react-native-reanimated';
import IconAllowNotification from '@assets/icon/IconAllowNotification';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconChangePassword from '@assets/icon/IconChangePassword';
import IconEditAvatar from '@assets/icon/IconEditAvatar';
import IconLanguage from '@assets/icon/IconLanguage';
import IconLogout from '@assets/icon/IconLogout';
import IconVietNam from '@assets/icon/IconVietNam';

const animatedDelay = (index: number) =>
  FadeInDown.delay(150 * index).springify();

const AccountScreen = () => {
  const {t} = useTranslation();
  const {infoUser} = useInfoUser();
  const {showAlert} = useAlert();
  const [allowNotification, setAllowNotification] = useState(false);

  const toggleAllowNotification = () => setAllowNotification(prev => !prev);

  const goToChangePassword = () => navigate('ChangePasswordScreen');

  const onLogout = () => {
    showAlert(t('account.logout'), t('account.warningLogout'), [
      {text: t('account.profile.cancel'), style: 'cancel', onPress: () => {}},
      {text: t('account.confirm'), onPress: () => DataLocal.removeAll()},
    ]);
  };

  const goToProfile = () => navigate('ProfileScreen');

  return (
    <View style={styles.container}>
      <Animated.View entering={animatedDelay(0)}>
        <AppBlockButton onPress={goToProfile} style={styles.centerAlign}>
          <View>
            <AppImage
              style={styles.avatar}
              source={{uri: infoUser?.profile?.avatar}}
            />
            <IconEditAvatar style={styles.editIcon} />
          </View>
          <AppText weight="700" size={18} mb={2}>
            {infoUser?.profile?.fullName}
          </AppText>
          <AppText
            pv={2}
            ph={6}
            radius={2}
            weight="500"
            size={12}
            mb={12}
            background={Colors.BLACK_100}>
            {infoUser?.userName}
          </AppText>
        </AppBlockButton>
      </Animated.View>

      {[
        {
          key: 'language',
          icon: <IconLanguage />,
          title: t('account.language'),
          right: (
            <>
              <IconVietNam />
              <AppText weight="700" size={14} ml={4}>
                {t('account.VietNam')}
              </AppText>
            </>
          ),
        },
        {
          key: 'notification',
          icon: <IconAllowNotification />,
          title: t('account.allowNotification'),
          onPress: toggleAllowNotification,
          right: <Switch value={allowNotification} />,
        },
        {
          key: 'password',
          icon: <IconChangePassword />,
          title: t('account.changePasswordTitle'),
          onPress: goToChangePassword,
          right: <IconArrowRight />,
        },
        {
          key: 'logout',
          icon: <IconLogout />,
          title: t('account.logout'),
          onPress: onLogout,
          right: <IconArrowRight />,
        },
      ].map((item, index) => (
        <Animated.View key={item.key} entering={animatedDelay(index + 1)}>
          <AppBlockButton
            onPress={item.onPress}
            style={[styles.itemContainer, index === 0 && {borderTopWidth: 0}]}>
            <View style={styles.row}>
              {item.icon}
              <AppText weight="700" size={14} ml={6}>
                {item.title}
              </AppText>
            </View>
            <View style={styles.row}>{item.right}</View>
          </AppBlockButton>
        </Animated.View>
      ))}
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  centerAlign: {
    alignItems: 'center',
  },
  avatar: {
    width: s(90),
    height: s(90),
    borderRadius: s(90),
    alignSelf: 'center',
    marginBottom: s(6),
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(20),
    borderTopWidth: 0.5,
    borderTopColor: Colors.BLACK_100,
  },
});
