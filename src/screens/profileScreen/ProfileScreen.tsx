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
import IconTakeCamera from '@assets/icon/IconTakeCamera';
import { Colors } from '@/theme/Config';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import Utilities from '@/utils/Utilities';
import api from '@/utils/setup-axios';
import { ENDPOINT } from '@/utils/Constans';
import { useAlert } from '@/elements/alert/AlertProvider';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { BASE_URL } from '@/env';
import FastImage from 'react-native-fast-image';

const ProfileScreen = ({ navigation }: NativeStackScreenProps<MainParams, 'ProfileScreen'>) => {
  const { t } = useTranslation();
  const { infoUser, updateAvatar } = useInfoUser();
  const { showToast } = useAlert();
  console.log('first,', infoUser);
  const onUploadAvatar = async (imageAvatar: ResponseImageElement) => {
    // return updateAvatar('https://i.pinimg.com/736x/9c/2e/5e/9c2e5e3d63454104bdee33258fca0a28.jpg');
    try {
      const uri = imageAvatar?.path || imageAvatar?.sourceURL || imageAvatar?.uri;
      let formData: any = new FormData();
      formData.append('file', {
        uri: Utilities.normalizeUri(uri || ''),
        type: imageAvatar?.type ?? imageAvatar?.mime,
        name: `avatar_${imageAvatar?.filename || uri}`,
      });
      // formData.append('type', 'avatar');
      const response = await api.post(ENDPOINT.UPLOAD_AVATAR, formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      if (response.status !== 200) {
        throw new Error();
      }
      console.log('avatar: ', response.data);
      if (!response.data.isSuccess) {
        return showToast(response.data.errors[0].message, TYPE_TOAST.ERROR);
      } else {
        console.log(
          'alo avatar: ',
          response.data.data.url,
          `${BASE_URL}/${response.data.data.url}`,
        );
        updateAvatar(`${response.data.data.url}`);
        // updateAvatar(`${BASE_URL}/${response.data.data.url}`);
      }
    } catch (error) {
      showToast(t('error.subtitle'), TYPE_TOAST.ERROR);
    } finally {
    }
  };
  const onUpdateAvatar = () => {
    navigation.navigate('ModalPhotoOrCamera', { setImageAvatar: onUploadAvatar });
  };
  const data = [
    {
      label: t('account.profile.nameHotel'),
      value: infoUser?.hotelName || '',
    },
    {
      label: t('account.profile.userName'),
      value: infoUser?.userName || '',
    },
    {
      label: t('account.profile.fullName'),
      value: infoUser?.displayName || '',
    },
    {
      label: t('account.profile.rank'),
      value: infoUser?.groups[0]?.groupName || '',
    },
    {
      label: t('account.profile.email'),
      value: infoUser?.email || '',
    },
    {
      label: t('account.profile.department'),
      value: infoUser?.departments[0]?.departmentName || '',
    },
  ];

  return (
    <ViewContainer>
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <ScrollView contentContainerStyle={styles.fg1}>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.8} onPress={onUpdateAvatar}>
            <FastImage style={styles.avatar} source={{ uri: `${BASE_URL}/${infoUser?.avatar}` }} />
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
