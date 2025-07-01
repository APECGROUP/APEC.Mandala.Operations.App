import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '../../navigation/params';
import { AppBlock } from '../../elements/block/Block';
import { AppText } from '../../elements/text/AppText';
import light from '../../theme/light';
import { vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme/Config';
import { PaddingHorizontal } from '@/utils/Constans';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown } from 'react-native-reanimated';
import Utilities from '../../utils/Utilities';
import ViewContainer from '@/components/errorBoundary/ViewContainer';

type Props = NativeStackScreenProps<MainParams, 'ModalPhotoOrCamera'>;

const ModalPhotoOrCamera = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { setImageAvatar } = route.params;
  const { bottom } = useSafeAreaInsets();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePick = useCallback(
    async (isCamera: boolean) => {
      try {
        const value: any = await Utilities.showImagePicker({
          params: {
            with: 300,
            height: 300,
            multiple: false,
            forceJpg: true,
            cropping: isCamera,
          },
          isUsingCamera: isCamera,
        });

        if (!value) return;

        const uri = value?.path || value?.sourceURL || value?.uri;
        if (!uri) return;

        if (isCamera) {
          setImageAvatar(value);
        } else {
          const imageCrop: any = await Utilities.showImageCrop({ uri });
          setImageAvatar(imageCrop);
        }
      } catch (e) {
        console.log('Image Picker Error:', e);
      } finally {
        goBack();
      }
    },
    [goBack, setImageAvatar],
  );

  return (
    <ViewContainer>
      <TouchableWithoutFeedback onPress={goBack}>
        <View style={[styles.overlay, { paddingBottom: bottom }]}>
          <Animated.View entering={SlideInDown.springify().mass(0.5)}>
            <AppBlock background={light.white} style={styles.container}>
              <TouchableOpacity style={styles.option} onPress={() => handlePick(true)}>
                <AppText size={20} weight="600" color={'#007AFF'}>
                  {t('account.profile.takePhoto')}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.option, styles.borderWidth0]}
                onPress={() => handlePick(false)}>
                <AppText size={20} weight="600" color={'#007AFF'}>
                  {t('account.profile.updatePhoto')}
                </AppText>
              </TouchableOpacity>
            </AppBlock>

            <TouchableOpacity style={styles.cancelButton} onPress={goBack}>
              <AppText size={20} weight="600" color={Colors.RED_950}>
                {t('account.profile.cancel')}
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </ViewContainer>
  );
};

export default ModalPhotoOrCamera;

const styles = StyleSheet.create({
  borderWidth0: { borderBottomWidth: 0 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: PaddingHorizontal,
  },
  container: {
    borderRadius: 18,
    marginBottom: vs(14),
  },
  option: {
    paddingVertical: vs(17),
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.BLACK_100,
  },
  cancelButton: {
    paddingVertical: vs(17),
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: Colors.WHITE,
  },
});
