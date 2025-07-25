import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthParams } from '../../../../navigation/params';
import { AppBlock } from '../../../../elements/block/Block';
import { AppText } from '../../../../elements/text/AppText';
import light from '../../../../theme/light';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import IconClose from '../../../../../assets/icon/IconClose';
import { PaddingHorizontal } from '../../../../utils/Constans';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBlockButton from '../../../../elements/button/AppBlockButton';
import IconSelectHotel from '../../../../../assets/icon/IconSelectHotel';
import { useAlert } from '@/elements/alert/AlertProvider';
import { TYPE_TOAST } from '@/elements/toast/Message';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { useAuthViewModel } from '@/screens/authScreen/viewmodel/AuthViewModel';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
type Props = NativeStackScreenProps<AuthParams, 'ModalPickHotel'>;

const ModalPickHotel = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { showToast } = useAlert();
  const { setHotel, hotel } = route.params;
  // const { data, isLoading, error, hotel, setHotel } = usePickHotelViewModal();
  const { data, error, refetch, isLoading } = useAuthViewModel();
  const { bottom } = useSafeAreaInsets();
  const goBack = useCallback(() => {
    if (!hotel?.code) {
      showToast(t('auth.login.emptyHotel'), TYPE_TOAST.ERROR);
    }
    navigation.goBack();
  }, [hotel, navigation, showToast, t]);
  if (error) {
    return <FallbackComponent resetError={refetch} />;
  }
  return (
    <ViewContainer>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={goBack}>
        <View style={[styles.container, { paddingBottom: bottom }]}>
          <AppBlock
            pl={PaddingHorizontal}
            row
            justifyContent="space-between"
            alignItems="center"
            style={styles.borderWidth1}>
            <AppText size={20} weight="bold">
              {t('Khách sạn')}
            </AppText>
            <TouchableOpacity onPress={goBack} style={{ padding: PaddingHorizontal }}>
              <IconClose />
            </TouchableOpacity>
          </AppBlock>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={light.primary}
              style={{ marginVertical: vs(100) }}
            />
          ) : (
            <ScrollView style={[styles.scrollView]} showsVerticalScrollIndicator={false}>
              {data?.data.map((item, index) => {
                const isFocus = item?.code === hotel?.code;
                const onSelect = () => {
                  setHotel(item);
                  navigation.goBack();
                };
                return (
                  <AppBlockButton
                    key={index}
                    onPress={onSelect}
                    style={[isFocus ? styles.itemFocus : { padding: vs(10) }]}>
                    <AppText weight="500">{item?.name}</AppText>
                    {isFocus && <IconSelectHotel />}
                  </AppBlockButton>
                );
              })}
            </ScrollView>
          )}
        </View>
      </TouchableOpacity>
    </ViewContainer>
  );
};

export default ModalPickHotel;

const styles = StyleSheet.create({
  scrollView: { maxHeight: vs(300), paddingHorizontal: PaddingHorizontal, paddingTop: vs(10) },
  itemFocus: {
    backgroundColor: light.selected,
    padding: vs(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopRightRadius: s(8),
    borderTopLeftRadius: s(8),
    backgroundColor: light.white,
  },
  borderWidth1: {
    borderBottomWidth: 1,
    borderBottomColor: light.border,
  },
});
