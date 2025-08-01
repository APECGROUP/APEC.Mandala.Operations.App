import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppButton } from '@/elements/button/AppButton';
import { AppText } from '@/elements/text/AppText';
import IconAutoAssign from '@assets/icon/IconAutoAssign';
import IconSaveTmp from '@assets/icon/IconSaveTmp';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { PaddingHorizontal } from '@/utils/Constans';
import { Colors } from '@/theme/Config';
import { useAlert } from '@/elements/alert/AlertProvider';
import FastImage from 'react-native-fast-image';
import Images from '@assets/image/Images';
import { TYPE_TOAST } from '@/elements/toast/Message';
import { goBack, navigate } from '@/navigation/RootNavigation';

const FooterInformationItem = ({ onAutoAssign }: { onAutoAssign: () => void }) => {
  const { t } = useTranslation();
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [isLoadingAssign, setIsLoadingAssign] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const { showAlert, showToast } = useAlert();

  const onRejectSuccess = () => {
    showAlert(
      t('informationItem.rejectSuccess'),
      '',
      [
        {
          text: t('Trở về'),
          onPress: goBack,
        },
      ],
      <FastImage
        source={Images.ModalApprovedError}
        style={{ width: s(285), aspectRatio: 285 / 187 }}
      />,
    );
  };

  const onReject = async () => {
    setIsLoadingReject(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    navigate('ModalInputRejectAssign', { id: '123', onRejectSuccess: onRejectSuccess });
    setIsLoadingReject(false);
  };
  const onAssign = async () => {
    setIsLoadingAssign(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoadingAssign(false);
    showAlert(
      t('informationItem.assignSuccess'),
      '',
      [
        {
          text: t('Trở về'),
          onPress: () => {
            goBack();
          },
        },
      ],
      <FastImage
        source={Images.ModalApprovedSuccess}
        style={{ width: s(285), aspectRatio: 285 / 187 }}
      />,
      // <ConfettiAnimation
      //   autoPlay={true}
      //   loop={false}
      //   style={{
      //     position: 'absolute',
      //     top: 0,
      //     left: 0,
      //   }}
      // />,
    );
  };

  const onPressAutoAssign = () => {
    showToast(t('informationItem.autoAssignSuccess'), TYPE_TOAST.SUCCESS);
    onAutoAssign();
  };

  const onSave = () => {
    showToast(t('informationItem.saveDraftSuccess'), TYPE_TOAST.SUCCESS);
  };
  return (
    <View style={[styles.bottomContainer, { paddingBlock: bottom }]}>
      <View style={styles.footerContainer}>
        <AppBlockButton onPress={onPressAutoAssign} style={styles.footerButton}>
          <IconAutoAssign />
          <AppText size={14} weight="700" color={Colors.BLACK_900} mt={4}>
            {t('informationItem.autoAssign')}
          </AppText>
        </AppBlockButton>
        <View style={styles.footerDivider} />
        <AppBlockButton onPress={onSave} style={styles.footerButton}>
          <IconSaveTmp />
          <AppText size={14} weight="700" color={Colors.BLACK_900} mt={4}>
            {t('informationItem.saveDraft')}
          </AppText>
        </AppBlockButton>
      </View>
      <View style={styles.actionButtonsContainer}>
        <View style={styles.blockButton}>
          <AppButton
            width={s(162)}
            onPress={onReject}
            processing={isLoadingReject}
            style={styles.rejectButton}>
            <AppText size={14} weight="700" color={Colors.WHITE}>
              {t('informationItem.reject')}
            </AppText>
          </AppButton>
        </View>
        <View style={styles.blockButton}>
          <AppButton
            width={s(162)}
            onPress={onAssign}
            processing={isLoadingAssign}
            style={styles.buttonAssign}>
            <AppText size={14} weight="700" color={Colors.WHITE}>
              {t('informationItem.assign')}
            </AppText>
          </AppButton>
        </View>
      </View>
    </View>
  );
};

export default FooterInformationItem;

const styles = StyleSheet.create({
  buttonAssign: {
    width: s(162),
    height: vs(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    borderRadius: s(8),
  },
  blockButton: { width: s(162), alignItems: 'center' },

  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(20),
  },
  rejectButton: {
    width: s(162),
    height: vs(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.ERROR_600,
    borderRadius: s(8),
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerDivider: {
    width: s(2),
    height: vs(29),
    backgroundColor: Colors.BLACK_100,
  },
  bottomContainer: {
    backgroundColor: Colors.WHITE,
    paddingTop: vs(8),
    paddingHorizontal: PaddingHorizontal,
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
