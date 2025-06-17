import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthParams} from '../../navigation/params';
import {AppBlock} from '../../elements/block/Block';
import {AppText} from '../../elements/text/AppText';
import light from '../../theme/light';
import {s, vs} from 'react-native-size-matters';
import {useTranslation} from 'react-i18next';
import IconClose from '../../../assets/icon/IconClose';
import {PaddingHorizontal} from '../../utils/Constans';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppBlockButton from '../../elements/button/AppBlockButton';
import IconSelectHotel from '../../../assets/icon/IconSelectHotel';
import Animated, {FadeInDown, SlideInDown} from 'react-native-reanimated';

type Props = NativeStackScreenProps<AuthParams, 'ModalPickHotel'>;
const fakeData = [
  {
    name: 'Mandala Retreats Kim Bôi',
    id: 1,
  },
  {
    name: 'Mandala Cham Bay Mũi Né',
    id: 2,
  },
  {
    name: 'Mandala Hotel & Spa Phú Yên',
    id: 3,
  },
  {
    name: 'Mandala Hotel & Suites Bắc Giang',
    id: 4,
  },
  {
    name: 'Mandala Hotel & Suites Hải Dương',
    id: 5,
  },
  {
    name: 'Mandala Hotel & Spa Bắc Ninh',
    id: 6,
  },
];
const ModalPickHotel = ({navigation, route}: Props) => {
  const {t} = useTranslation();
  const {setHotel, hotel} = route.params;
  const {bottom} = useSafeAreaInsets();
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={goBack}>
      <Animated.View
        entering={FadeInDown.delay(0).duration(0).springify()}
        style={styles.container}>
        <AppBlock
          pl={PaddingHorizontal}
          row
          justifyContent="space-between"
          alignItems="center"
          style={{borderBottomWidth: 1, borderBottomColor: light.border}}>
          <AppText size={20} weight="bold">
            {t('Khách sạn')}
          </AppText>
          <TouchableOpacity
            onPress={goBack}
            style={{padding: PaddingHorizontal}}>
            <IconClose />
          </TouchableOpacity>
        </AppBlock>

        <AppBlock pt={10} pb={bottom} ph={PaddingHorizontal}>
          {fakeData.map((item, index) => {
            const isFocus = item?.id === hotel?.id;
            const onSelect = () => {
              setHotel(item);
              navigation.goBack();
            };
            return (
              <AppBlockButton
                key={index}
                onPress={onSelect}
                style={[isFocus ? styles.itemFocus : {padding: vs(10)}]}>
                <AppText weight="500">{item.name}</AppText>
                {isFocus && <IconSelectHotel />}
              </AppBlockButton>
            );
          })}
        </AppBlock>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ModalPickHotel;

const styles = StyleSheet.create({
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
