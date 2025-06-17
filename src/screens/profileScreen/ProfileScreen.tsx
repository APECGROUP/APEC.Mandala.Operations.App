import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainParams} from '../../navigation/params';
import {useTranslation} from 'react-i18next';
import Reanimated, {FadeInDown} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import {s, vs} from 'react-native-size-matters';
import IconCamera from '../../../assets/icon/IconCamera';
import {AppBlock} from '../../elements/block/Block';
import light from '../../theme/light';
import {ResponseImageElement} from '../../interface/Verify.interface';
import {AppText} from '../../elements/text/AppText';
import {useInfoUser} from '../../zustand/store/useInfoUser/useInfoUser';
import {getFontSize} from '../../constants';
import moment from 'moment';
import api from '../../utils/setup-axios';
import Toast from 'react-native-toast-message';
import {LanguageType} from '../../languages/locales/type';
import {DOMAIN_IMAGE} from '../../env';
import DataLocal from '../../data/DataLocal';
import Utilities from '../../utils/Utilities';
import AppImage from '../../elements/appImage/AppImage';
import IconTakeCamera from '@assets/icon/IconTakeCamera';
import {Colors} from '@/theme/Config';

const ProfileScreen = ({
  navigation,
}: NativeStackScreenProps<MainParams, 'ProfileScreen'>) => {
  const {t} = useTranslation();
  const {infoUser, updateAvatar} = useInfoUser();

  const onUploadAvatar = async (imageAvatar: ResponseImageElement) => {
    try {
      const uri =
        imageAvatar?.path || imageAvatar?.sourceURL || imageAvatar?.uri;
      let formData: any = new FormData();
      formData.append('file', {
        uri: Utilities.normalizeUri(uri || ''),
        type: imageAvatar?.type ?? imageAvatar?.mime,
        name: `avatar_${imageAvatar?.filename || uri}`,
      });
      formData.append('type', 'avatar');
      const response = await api.post('user/commons/upload-file', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      if (response.status !== 200 || response.data.status !== 0) {
        throw new Error();
      }
      if (response.data.status === 0) {
        updateAvatar(response.data.data.profile.avatar);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: t(LanguageType.errorTryAgain),
      });
    } finally {
    }
  };
  const onUpdateAvatar = () => {
    navigation.navigate('ModalPhotoOrCamera', {setImageAvatar: onUploadAvatar});
  };
  const AnimationButton = Reanimated.createAnimatedComponent(TouchableOpacity);
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
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <AnimationButton
          entering={FadeInDown.delay(0).duration(0).springify()}
          style={styles.avatar}
          activeOpacity={0.8}
          onPress={onUpdateAvatar}>
          <AppImage
            style={styles.avatar}
            source={{uri: infoUser?.profile?.avatar}}
          />
          <IconTakeCamera style={styles.editIcon} />
        </AnimationButton>
        <AppText style={styles.textTitle}>
          {t('account.profile.changePhoto')}
        </AppText>

        {data.map((item, index) => (
          <Reanimated.View
            entering={FadeInDown.delay(150 * (index + 1))
              .duration(0)
              .springify()}
            key={index}
            style={[styles.textRow, index === 0 && {borderTopWidth: 0}]}>
            <AppText style={styles.textLabel}>{t(item.label)}</AppText>
            <AppText style={styles.textValue}>{String(item.value)}</AppText>
          </Reanimated.View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  buttonEdit: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: light.primary,
    height: vs(40),
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
  valueContainer: {
    flex: 1,
  },
  textValue: {
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  emailActionWrapper: {
    marginTop: vs(2),
  },
  verifyText: {
    color: '#007AFF',
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
  emailNote: {
    color: 'red',
    fontSize: getFontSize(11),
    marginTop: vs(2),
  },
  avatar: {
    width: s(90),
    height: s(90),
    borderRadius: s(90),
    alignSelf: 'center',
    marginBottom: s(8),
  },
  cameraIconWrapper: {
    width: vs(20),
    height: vs(20),
    borderRadius: vs(20),
    backgroundColor: light.white,
    position: 'absolute',
    bottom: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
