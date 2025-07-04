import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '../../navigation/params';
import { useTranslation } from 'react-i18next';
import { s, vs } from 'react-native-size-matters';
import { ResponseImageElement } from '../../interface/Verify.interface';
import { AppText } from '../../elements/text/AppText';
import { useInfoUser } from '../../zustand/store/useInfoUser/useInfoUser';
import { getFontSize } from '../../constants';
import AppImage from '../../elements/appImage/AppImage';
import IconTakeCamera from '@assets/icon/IconTakeCamera';
import { Colors } from '@/theme/Config';
import ViewContainer from '@/components/errorBoundary/ViewContainer';

const ProfileScreen = ({ navigation }: NativeStackScreenProps<MainParams, 'ProfileScreen'>) => {
  const { t } = useTranslation();
  const { infoUser, updateAvatar } = useInfoUser();

  const onUploadAvatar = async (imageAvatar: ResponseImageElement) => {
    if (imageAvatar) {
      return updateAvatar('https://mdbcdn.b-cdn.net/img/new/avatars/2.webp');
    }
    // try {
    //   const uri = imageAvatar?.path || imageAvatar?.sourceURL || imageAvatar?.uri;
    //   let formData: any = new FormData();
    //   formData.append('file', {
    //     uri: Utilities.normalizeUri(uri || ''),
    //     type: imageAvatar?.type ?? imageAvatar?.mime,
    //     name: `avatar_${imageAvatar?.filename || uri}`,
    //   });
    //   formData.append('type', 'avatar');
    //   const response = await api.post('user/commons/upload-file', formData, {
    //     headers: {
    //       'content-type': 'multipart/form-data',
    //       Accept: 'application/json',
    //     },
    //   });
    //   if (response.status !== 200 || response.data.status !== 0) {
    //     throw new Error();
    //   }
    //   if (response.data.status === 0) {
    //     updateAvatar(response.data.data.profile.avatar);
    //   }
    // } catch (error) {
    //   Toast.show({
    //     type: 'error',
    //     text2: t(LanguageType.errorTryAgain),
    //   });
    // } finally {
    // }
  };
  const onUpdateAvatar = () => {
    navigation.navigate('ModalPhotoOrCamera', { setImageAvatar: onUploadAvatar });
  };
  const data = [
    {
      label: t('account.profile.userName'),
      value: infoUser?.userName || '',
    },
    {
      label: t('account.profile.fullName'),
      value: infoUser?.profile?.fullName || '',
    },
    {
      label: t('account.profile.rank'),
      value: infoUser?.profile?.jobPosition || '',
    },
    {
      label: t('account.profile.email'),
      value: infoUser?.profile.email || '',
    },
    {
      label: t('account.profile.department'),
      value: infoUser?.profile?.jobPosition || '',
    },
  ];
  console.log('infoUser: ', infoUser);

  return (
    <ViewContainer>
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <ScrollView contentContainerStyle={styles.fg1}>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.8} onPress={onUpdateAvatar}>
            <AppImage style={styles.avatar} source={{ uri: infoUser?.profile?.avatar }} />
            <IconTakeCamera style={styles.editIcon} />
          </TouchableOpacity>
          <AppText style={styles.textTitle}>{t('account.profile.changePhoto')}</AppText>

          {data.map((item, index) => (
            <View key={index} style={[styles.textRow, index === 0 && styles.borderWidth0]}>
              <AppText style={styles.textLabel}>{t(item.label)}</AppText>
              <AppText style={styles.textValue}>{String(item.value)}</AppText>
            </View>
          ))}
        </ScrollView>
      </View>
    </ViewContainer>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  fg1: { flexGrow: 1 },
  borderWidth0: { borderTopWidth: 0 },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  textTitle: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    alignSelf: 'center',
    marginBottom: vs(20),
  },
  textRow: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.BLACK_100,
    flexDirection: 'row',
    paddingVertical: vs(16),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textLabel: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  textValue: {
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  avatar: {
    width: s(90),
    height: s(90),
    borderRadius: s(90),
    alignSelf: 'center',
    marginBottom: s(8),
  },
});
