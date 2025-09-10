import React from 'react';
import { StatusBar, StyleSheet, Switch, View } from 'react-native';
import { Colors } from '@/theme/Config';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import { s, vs } from 'react-native-size-matters';
import { AppText } from '@/elements/text/AppText';

import { useTranslation } from 'react-i18next';
import { useAlert } from '@/elements/alert/AlertProvider';
import DataLocal from '@/data/DataLocal';
import { navigate } from '@/navigation/RootNavigation';
import IconAllowNotification from '@assets/icon/IconAllowNotification';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconChangePassword from '@assets/icon/IconChangePassword';
import IconEditAvatar from '@assets/icon/IconEditAvatar';
import IconLanguage from '@assets/icon/IconLanguage';
import IconLogout from '@assets/icon/IconLogout';
import IconVietNam from '@assets/icon/IconVietNam';
import { useLanguage } from '@/hook/useLanguage';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { appVersion } from '@/hook/useOtaUpdate';
import RightItemAccount from './RightItemAccount';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '@/utils/setup-axios';
import { ENDPOINT } from '@/utils/Constans';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { useQueryClient } from '@tanstack/react-query';
import { checkTurnOnOffNotification } from '../authScreen/modal/AuthModal';
import FastImage from 'react-native-fast-image';

const AccountScreen = () => {
  const { t } = useTranslation();
  const { infoUser, toggleTurnOnOffNotification } = useInfoUser();
  const { bottom } = useSafeAreaInsets();
  const { showAlert, showToast, showLoading, hideLoading } = useAlert();

  const { toggleLanguage } = useLanguage();
  // const [isHasUpdate, setIsHasUpdate] = useState(false);
  // const { isHasUpdate, isCheckingUpdate, isDone, isSuccess, isError } = useCheckUpdate();
  // const { checkForOtaUpdate } = useOtaUpdate();

  const toggleAllowNotification = async () => {
    try {
      showLoading();
      const { isSuccess, message } = await checkTurnOnOffNotification();
      if (!isSuccess) {
        showToast(message || t('error.subtitle'), 'error');
        return;
      }

      if (!infoUser?.isNotification) {
        showToast(t('account.allowNotificationSubtitle'), TYPE_TOAST.SUCCESS);
        toggleTurnOnOffNotification(true);
        // Toast.show({
        //   text2: t('account.allowNotificationSubtitle'),
        //   type: 'success',
        // });
      } else {
        showToast(t('account.allowNotificationSubtitle2'), TYPE_TOAST.SUCCESS);
        toggleTurnOnOffNotification(false);

        // Toast.show({
        //   text2: t('account.allowNotificationSubtitle2'),
        //   type: 'success',
        // });
      }
    } catch (error) {
    } finally {
      hideLoading();
    }
  };

  // const onCheckUpdate = () => {
  //   showAlert(t('account.checkUpdate'), t('account.checkUpdate'), [
  //     { text: t('account.profile.cancel'), style: 'cancel', onPress: () => {} },
  //     { text: t('account.confirm'), onPress: () => {} },
  //   ]);
  // };
  const queryClient = useQueryClient();

  const goToChangePassword = () => navigate('ChangePasswordScreen', { type: 'change' });
  const handleLogout = async () => {
    try {
      showLoading();
      const response = await api.get(ENDPOINT.LOGOUT);
      if (response.status !== 200) {
        throw new Error('Logout failed');
      } else if (response.data.isSuccess) {
        await queryClient.clear();
        await DataLocal.removeAll();
      }
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    } finally {
      hideLoading();
    }
  };
  const onLogout = () => {
    showAlert(t('account.logout'), t('account.warningLogout'), [
      { text: t('account.profile.cancel'), style: 'cancel', onPress: () => {} },
      { text: t('account.confirm'), onPress: handleLogout },
    ]);
  };

  const goToProfile = () => navigate('ProfileScreen');

  return (
    <ViewContainer>
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.TRANSPARENT} />
        <View>
          <View>
            <AppBlockButton onPress={goToProfile} style={styles.centerAlign}>
              <View style={{ marginTop: vs(20) }}>
                <FastImage style={styles.avatar} source={{ uri: infoUser?.avatar }} />
                <IconEditAvatar style={styles.editIcon} />
              </View>
              <AppText weight="700" size={18} mb={2}>
                {infoUser?.displayName}
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
          </View>

          {[
            {
              key: 'language',
              icon: <IconLanguage />,
              title: t('account.language'),
              onPress: toggleLanguage,
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
              right: <Switch value={infoUser?.isNotification} />,
            },
            // {
            //   key: 'checkUpdate',
            //   icon: <IconChangePassword />,
            //   title: t('account.checkUpdate'),
            //   onPress: checkForOtaUpdate,
            //   right: <IconArrowRight />,
            // },
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
            <View>
              <AppBlockButton
                onPress={item.onPress}
                style={[styles.itemContainer, index === 0 && styles.border0]}>
                <View style={styles.row}>
                  {item.icon}
                  <AppText weight="700" size={14} ml={6}>
                    {item.title}
                  </AppText>
                </View>
                {item.key === 'checkUpdate' ? (
                  <RightItemAccount item={item} />
                ) : (
                  <View style={styles.row}>{item.right}</View>
                )}
              </AppBlockButton>
            </View>
          ))}
        </View>
        <AppText mb={bottom} size={12} weight="bold" style={styles.center}>
          version: {appVersion}
        </AppText>
      </View>
    </ViewContainer>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  border0: { borderTopWidth: 0 },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'space-between',
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
