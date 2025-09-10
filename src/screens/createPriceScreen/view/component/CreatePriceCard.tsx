import React, { useCallback, useMemo, memo, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { s, ScaledSheet, vs } from 'react-native-size-matters';
import IconListPen from '@assets/icon/IconListPen';
import { IItemVendorPrice } from '../../modal/CreatePriceModal';
import { getFontSize } from '@/constants';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconTrashPrice from '@assets/icon/IconTrashPrice';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';
import ReanimatedSwipeable, { ReanimatedSwipeableRef } from './ReanimatedSwipeable';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '@/theme/Config';
import { moneyFormat } from '@/utils/Utilities';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { AnimatedButton } from '@/screens/approvePrScreen/view/ApprovePrScreen';
import { navigate } from '@/navigation/RootNavigation';
import { AppBlock } from '@/elements/block/Block';
import { PaddingHorizontal } from '@/utils/Constans';

interface CreatePriceCardProps {
  item: IItemVendorPrice;
  isSelected: boolean;
  handleSelect: (id: number) => void;
  simultaneousGesture: any;
  handleDelete: (
    id: number,
    onSuccess?: (deletedId: number) => void,
    onCancel?: () => void,
  ) => void;
  onUpdateItem: (i: IItemVendorPrice) => void;
  canPick: boolean;
}

const CreatePriceCard = memo<CreatePriceCardProps>(
  ({
    item,
    isSelected,
    handleSelect,
    onUpdateItem,
    simultaneousGesture,
    handleDelete,
    canPick,
  }) => {
    const { t } = useTranslation();
    const swipeableRef = useRef<ReanimatedSwipeableRef>(null);
    // SharedValue để đồng bộ chiều cao cho delete button
    const heightAction = useSharedValue(0);
    const animatedDeleteStyle = useAnimatedStyle(() => ({
      height: heightAction.value,
    }));

    // onLayout gọi mỗi khi layout thay đổi (do expand/collapse)
    const onItemLayout = useCallback((e: any) => {
      const height = e.nativeEvent.layout.height - vs(1);
      heightAction.value = withTiming(height, { duration: 0 });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCloseSwipe = useCallback(() => {
      console.log('close swipe callback triggered');
      swipeableRef.current?.closeSwipe();
    }, []);

    const handleDeleteWithClose = useCallback(() => {
      console.log('id nè: ', item.id);
      handleDelete(item.id, undefined, onCloseSwipe);
    }, [handleDelete, onCloseSwipe, item.id]);

    // Phần render nút delete
    const renderRightActions = useCallback(
      () => (
        <AnimatedButton
          activeOpacity={1}
          style={[styles.deleteBtn, animatedDeleteStyle]}
          onPress={handleDeleteWithClose}>
          <IconTrashPrice />
        </AnimatedButton>
      ),
      [animatedDeleteStyle, handleDeleteWithClose],
    );

    const handleSelectPress = useCallback(() => {
      handleSelect(item.id);
    }, [handleSelect, item.id]);

    const formattedPrice = useMemo(
      () => `${moneyFormat(item.price, '.', '')}/${item.unitName.trim()}/${item.vatCode}`,
      [item.price, item.unitName, item.vatCode],
    );

    const detailItems = useMemo(
      () => [
        {
          label: t('createPrice.time'),
          value: `${moment(item.validFrom).format('DD/MM/YYYY')} - ${moment(item.validTo).format(
            'DD/MM/YYYY',
          )}`,
        },
        { label: t('createPrice.ncc'), value: item.vendorName },
      ],
      [t, item.validFrom, item.validTo, item.vendorName],
    );

    const onSwipe = useCallback(() => {
      handleDelete(item.id, undefined, onCloseSwipe);
    }, [handleDelete, item.id, onCloseSwipe]);

    const onEdit = useCallback(() => {
      navigate('EditPriceNCCScreen', { item, onUpdateItem });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);
    return (
      <TouchableOpacity onPress={onEdit}>
        <ReanimatedSwipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          simultaneousGesture={simultaneousGesture}
          onSwipe={onSwipe}>
          <View style={[styles.itemContainer, styles.itemExpanded]} onLayout={onItemLayout}>
            <View style={styles.headerItem}>
              {canPick ? (
                <AppBlockButton onPress={handleSelectPress} style={styles.left}>
                  {isSelected ? <IconCheckBox /> : <IconUnCheckBox />}
                </AppBlockButton>
              ) : (
                <AppBlock width={PaddingHorizontal} />
              )}

              <View style={styles.center}>
                <View style={styles.row}>
                  <View style={styles.iconWrapper}>
                    <IconListPen />
                  </View>
                  <View style={styles.nameWrapper}>
                    <AppText numberOfLines={1} style={styles.name}>
                      {item.itemName}
                    </AppText>
                    <View style={styles.row}>
                      <AppText style={styles.titlePrice}>{t('createPrice.price')}: </AppText>
                      <AppText style={styles.price}>{formattedPrice}</AppText>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.expandedContent}>
              {detailItems.map(({ label, value }, idx) => (
                <View key={idx} style={styles.detailRow}>
                  <AppText style={styles.detailLabel}>{label}</AppText>
                  <AppText style={styles.detailValue}>{value}</AppText>
                </View>
              ))}
            </View>
          </View>
        </ReanimatedSwipeable>
      </TouchableOpacity>
    );
  },
);

CreatePriceCard.displayName = 'CreatePriceCard';

export default CreatePriceCard;

const styles = ScaledSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: s(8),
    marginVertical: vs(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemExpanded: {
    paddingTop: vs(6),
  },
  itemCollapsed: {
    paddingVertical: vs(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: s(42),
    height: s(42),
    borderRadius: s(42),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9F1EA',
    marginRight: s(8),
  },
  nameWrapper: {
    height: s(42),
    justifyContent: 'space-between',
  },
  expandedContent: {
    marginTop: vs(8),
    paddingTop: vs(8),
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    paddingHorizontal: s(16),
    borderStyle: 'dotted',
  },
  detailRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: vs(6),
  },
  detailLabel: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: '#727272',
  },
  detailValue: {
    fontSize: getFontSize(14),
    maxWidth: '80%',
    fontWeight: '700',
    textAlign: 'right',
    color: '#141414',
  },
  headerItem: {
    flexDirection: 'row',
  },
  left: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40@s',
  },
  center: {
    flex: 1,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40@s',
  },
  name: {
    maxWidth: s(230),
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  titlePrice: {
    // maxWidth: '30%',
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY,
  },
  price: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  detail: {
    fontSize: '12@ms',
    color: '#999',
  },
  deleteBtn: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: s(50),
    borderRadius: '8@s',
  },
});
