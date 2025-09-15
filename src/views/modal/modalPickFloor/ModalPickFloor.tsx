import React, { useCallback, useState, useMemo } from 'react';
import { TouchableOpacity, View, FlatList, Dimensions, Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { useAnimatedStyle, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import { AppText } from '@/elements/text/AppText';
import { MainParams } from '@/navigation/params';
import light from '@/theme/light';
import IconClose from '@assets/icon/IconClose';
import ViewContainer from '@/components/errorBoundary/ViewContainer';
import { goBack } from '@/navigation/RootNavigation';
import { getFontSize, SCREEN_HEIGHT } from '@/constants';
import { PaddingHorizontal } from '@/utils/Constans';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';
import { AppButton } from '@/elements/button/AppButton';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';
import AppInputSearch from '@/elements/textInput/AppInputSearch';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme/Config';
import AppBlockButton from '@/elements/button/AppBlockButton';
import Utilities from '@/utils/Utilities';
import IconEmptyNcc from '@assets/icon/IconEmptyNcc';
import { useHk } from '@/zustand/store/useHk/useHk';

moment.locale('vi');

type Props = NativeStackScreenProps<MainParams, 'ModalPickFloor'>;

const { width } = Dimensions.get('window');
const itemWidth = (width - PaddingHorizontal - s(48)) / 3;

const ModalPickFloor = ({ route }: Props) => {
  const { floor, setFloor } = route.params;
  const [selectedFloor, setSelectedFloor] = useState(floor);
  const { listFloor } = useHk();
  const { bottom } = useSafeAreaInsets();
  const translateY = useSharedValue(500);
  const { t } = useTranslation();
  const [searchKey, setSearchKey] = useState('');

  React.useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 200,
    });
  }, [translateY]);

  const onClose = useCallback(
    (func: () => void) => {
      translateY.value = withTiming(
        500,
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
    setFloor(selectedFloor);
    onClose(goBack);
  }, [onClose, selectedFloor, setFloor]);

  const onReset = useCallback(() => {
    setSelectedFloor([]);
  }, []);

  const onSelectAll = useCallback(() => {
    if (selectedFloor?.length === listFloor?.length) {
      setSelectedFloor([]);
    } else {
      setSelectedFloor(listFloor);
    }
  }, [listFloor, selectedFloor?.length]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const filteredFloors = useMemo(() => {
    if (!searchKey) {
      return listFloor;
    }
    return listFloor?.filter(item =>
      Utilities.removeVietnameseTones(item.name.toLowerCase()).includes(
        Utilities.removeVietnameseTones(searchKey.toLowerCase()),
      ),
    );
  }, [listFloor, searchKey]);

  const renderFloorItem = useCallback(
    ({ item }: { item: { name: string; id: string } }) => {
      const isSelected = selectedFloor?.some(i => i.id === item.id);
      const toggleSelect = () => {
        if (isSelected) {
          setSelectedFloor(prev => prev?.filter(i => i.id !== item.id));
        } else {
          setSelectedFloor(prev => [...(prev || []), item]);
        }
      };

      return (
        <AppBlockButton
          onPress={toggleSelect}
          style={[
            styles.floorButton,
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
    },
    [selectedFloor],
  );

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <IconEmptyNcc />
      <AppText size={18} weight="700" mt={12}>
        Không có dữ liệu
      </AppText>
    </View>
  );

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
              height: SCREEN_HEIGHT * 0.6,
            },
            animatedStyle,
          ]}>
          <View style={styles.header}>
            <AppText style={styles.title}>Chọn tầng</AppText>
            <TouchableOpacity onPress={onGoBack} style={{ paddingHorizontal: PaddingHorizontal }}>
              <IconClose />
            </TouchableOpacity>
          </View>
          <AppInputSearch
            fill={Colors.BLACK_100}
            showIconRemove
            containerStyle={styles.searchInput}
            value={searchKey}
            onChangeText={setSearchKey}
            placeholder={t('filter.search')}
          />
          <AppBlockButton onPress={onSelectAll} style={styles.selectAllContainer}>
            {selectedFloor?.length === listFloor?.length ? <IconCheckBox /> : <IconUnCheckBox />}
            <AppText style={styles.selectAllText}>Chọn tất cả</AppText>
          </AppBlockButton>
          <View style={styles.listContainer}>
            <FlatList
              data={filteredFloors}
              renderItem={renderFloorItem}
              keyExtractor={item => item.id}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={listEmptyComponent}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
          <View style={styles.buttonGroup}>
            <AppButton
              width={'48%'}
              onPress={onReset}
              text="Thiết lập lại"
              style={styles.resetButton}
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

export default ModalPickFloor;

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
  floorButton: {
    width: itemWidth,
    height: vs(30),
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
  resetButton: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
});
