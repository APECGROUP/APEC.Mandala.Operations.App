// views/modal/modalPickHotel/ModalPickHotel.tsx
import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlert } from '@/elements/alert/AlertProvider';
import { TYPE_TOAST } from '@/elements/toast/Message';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import FallbackComponent from '@/components/errorBoundary/FallbackComponent';
import { AppBlock } from '@/elements/block/Block';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import { AuthParams } from '@/navigation/params';
import { useAuthViewModel } from '@/screens/authScreen/viewmodel/AuthViewModel';
import light from '@/theme/light';
import { PaddingHorizontal } from '@/utils/Constans';
import IconClose from '@assets/icon/IconClose';
import IconSelectHotel from '@assets/icon/IconSelectHotel';
import { IDataListHotel } from '../modal/PickHotelModal';

type ModalPickHotelRouteParams = {
  hotel: IDataListHotel | undefined;
  setHotel: (newHotel: IDataListHotel | undefined) => void;
};

type Props = NativeStackScreenProps<AuthParams, 'ModalPickHotel'>;

const ModalPickHotel = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { showToast } = useAlert();
  const { hotel, setHotel } = route.params as ModalPickHotelRouteParams;

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
            style={styles.header}>
            <AppText size={20} weight="bold">
              {t('Khách sạn')}
            </AppText>
            <TouchableOpacity onPress={goBack} style={styles.closeButton}>
              <IconClose />
            </TouchableOpacity>
          </AppBlock>
          {isLoading ? (
            <ActivityIndicator size="large" color={light.primary} style={styles.loadingIndicator} />
          ) : (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {data?.data.map((item, index) => {
                const isFocused = item?.code === hotel?.code;
                const onSelect = () => {
                  setHotel(item);
                  navigation.goBack();
                };
                return (
                  <AppBlockButton
                    key={item.code || index}
                    onPress={onSelect}
                    style={[styles.hotelItem, isFocused && styles.itemFocused]}>
                    <AppText weight="500">{item?.name}</AppText>
                    {isFocused && <IconSelectHotel />}
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
  scrollView: {
    maxHeight: vs(300),
    paddingHorizontal: PaddingHorizontal,
    paddingTop: vs(10),
  },
  hotelItem: {
    padding: vs(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    marginBottom: vs(5),
  },
  itemFocused: {
    backgroundColor: light.selected,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    borderTopRightRadius: s(8),
    borderTopLeftRadius: s(8),
    backgroundColor: light.white,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: light.border,
  },
  closeButton: {
    padding: PaddingHorizontal,
  },
  loadingIndicator: {
    marginVertical: vs(100),
  },
});
