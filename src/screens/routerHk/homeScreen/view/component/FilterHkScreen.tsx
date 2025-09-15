import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View, Dimensions, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { useAnimatedStyle, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import { AppText } from '@/elements/text/AppText';
import light from '@/theme/light';
import IconClose from '@assets/icon/IconClose';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { goBack } from '@/navigation/RootNavigation';
import { getFontSize, SCREEN_HEIGHT } from '@/constants';
import { PaddingHorizontal } from '@/utils/Constans';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';
import { AppButton } from '@/elements/button/AppButton';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme/Config';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { useHk } from '@/zustand/store/useHk/useHk';
import { AppBlock } from '@/elements/block/Block';
import IconDropDown from '@assets/icon/IconDropDown';

moment.locale('vi');

const { width } = Dimensions.get('window');
const itemWidth = (width - PaddingHorizontal * 2 - s(48)) / 4;

const FilterHkScreen = () => {
  const {
    floorSelected,
    setFloorSelected,
    buildingSelected,
    setBuildingSelected,
    listBuilding,
    onPressLocation,
    onPressBuilding,
  } = useHk();
  const { bottom } = useSafeAreaInsets();
  const translateY = useSharedValue(700);
  const { t } = useTranslation();

  React.useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 200,
    });
  }, [translateY]);

  const onClose = useCallback(
    (func: () => void) => {
      translateY.value = withTiming(
        700,
        {
          duration: 200,
        },
        finished => {
          if (finished) {
            runOnJS(func)();
          }
        },
      );
    },
    [translateY],
  );

  const onGoBack = useCallback(() => {
    onClose(goBack);
  }, [onClose]);

  const onSubmit = useCallback(() => {
    onClose(goBack);
  }, [onClose]);

  const onReset = useCallback(() => {
    setBuildingSelected(undefined);
    setFloorSelected([]);
  }, [setBuildingSelected, setFloorSelected]);

  console.log('listBuilding: ', listBuilding);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const onPickFloor = () => {
    buildingSelected?.id ? onPressLocation() : onPressBuilding();
  };
  return (
    <ViewContainer>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={() => {
          Keyboard.dismiss();
          //   onGoBack();
        }}>
        <AnimatedButton
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={[
            styles.container,
            {
              paddingBottom: bottom + vs(16),
              height: SCREEN_HEIGHT * 0.7,
            },
            animatedStyle,
          ]}>
          <View style={styles.header}>
            <AppText style={styles.title}>{t('hk.filter.title')}</AppText>
            <TouchableOpacity onPress={onGoBack} style={{ paddingHorizontal: PaddingHorizontal }}>
              <IconClose />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <AppText weight="600" mb={8} ml={PaddingHorizontal}>
              {t('hk.filter.building')}
            </AppText>
            <AppBlock row style={styles.blockWrap}>
              {listBuilding?.map(item => {
                const isSelected = buildingSelected?.id === item.id;
                return (
                  <AppBlockButton
                    onPress={() => setBuildingSelected(item)}
                    style={[
                      styles.BuildingButton,
                      {
                        backgroundColor: isSelected ? Colors.PRIMARY : Colors.BLACK_100,
                        //   borderColor: isSelected ? Colors.PRIMARY : Colors.BLACK_100,
                      },
                    ]}>
                    <AppText weight="600" color={isSelected ? Colors.WHITE : Colors.BLACK_900}>
                      {item.name}
                    </AppText>
                  </AppBlockButton>
                );
              })}
            </AppBlock>

            <View style={styles.containerBlock}>
              <AppBlockButton onPress={onPickFloor}>
                <AppText weight="600" mb={8}>
                  {t('hk.filter.floor')}
                </AppText>
                <View style={styles.rootSlectFloor}>
                  {floorSelected ? (
                    <AppText style={{ maxWidth: s(100) }} numberOfLines={1}>
                      {floorSelected?.map(floor => (
                        <AppText key={floor.id}>{floor.name}, </AppText>
                      ))}
                    </AppText>
                  ) : (
                    <AppText style={{}}>{t('hk.filter.selectFloor')}</AppText>
                  )}
                  <IconDropDown />
                </View>
              </AppBlockButton>
              <AppBlockButton onPress={onPickFloor}>
                <AppText weight="600" mb={8}>
                  {t('hk.filter.room')}
                </AppText>
                <View style={styles.blockFloorSelected}>
                  {floorSelected ? (
                    <AppText style={{ maxWidth: s(100) }} numberOfLines={1}>
                      {floorSelected?.map(floor => (
                        <AppText key={floor.id}>{floor.name}, </AppText>
                      ))}
                    </AppText>
                  ) : (
                    <AppText style={{}}>{t('hk.filter.selectRoom')}</AppText>
                  )}
                  <IconDropDown />
                </View>
              </AppBlockButton>
            </View>
          </ScrollView>

          <View style={styles.buttonGroup}>
            <AppButton
              width={'48%'}
              onPress={onReset}
              text="Thiết lập lại"
              style={styles.buttonReset}
              textColor={Colors.PRIMARY}
              //   textStyle={styles.resetButtonText}
            />
            <AppButton width={'48%'} onPress={onSubmit} text="Xác nhận" primary />
          </View>
        </AnimatedButton>
      </TouchableOpacity>
    </ViewContainer>
  );
};

export default FilterHkScreen;

const styles = ScaledSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: light.white,
    borderTopLeftRadius: s(12),
    borderTopRightRadius: s(12),
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: PaddingHorizontal,
    paddingTop: vs(20),
    paddingBottom: vs(16),
  },
  title: {
    fontSize: getFontSize(20),
    fontWeight: '600',
    color: '#0D0D0D',
  },
  searchInput: {
    borderRadius: s(6),
    borderWidth: 1,
    marginHorizontal: PaddingHorizontal,
    borderColor: Colors.BLACK_100,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingHorizontal,
    marginTop: vs(16),
  },
  selectAllText: {
    marginLeft: s(8),
  },
  listContainer: {
    height: vs(250),
    marginVertical: vs(16),
  },
  flatListContent: {
    paddingHorizontal: PaddingHorizontal / 2,
  },
  BuildingButton: {
    width: itemWidth,
    height: vs(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(8),
    marginHorizontal: s(8),
    marginBottom: vs(16),
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PaddingHorizontal,
    marginTop: vs(8),
  },
  resetButtonText: {
    color: Colors.PRIMARY,
  },
  blockWrap: {
    flexWrap: 'wrap',
    paddingHorizontal: PaddingHorizontal / 2,
  },
  containerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PaddingHorizontal,
  },
  rootSlectFloor: {
    borderWidth: 1,
    borderColor: Colors.BLACK_100,
    borderRadius: s(6),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(164),
  },
  blockFloorSelected: {
    borderWidth: 1,
    borderColor: Colors.BLACK_100,
    borderRadius: s(6),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(164),
  },
  buttonReset: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
});
