import React, { useState, useCallback, useMemo, memo } from 'react';
import { View } from 'react-native';
import { s, ScaledSheet, vs } from 'react-native-size-matters';
import IconListPen from '@assets/icon/IconListPen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TypeCreatePrice } from '../../modal/CreatePriceModal';
import { getFontSize } from '@/constants';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconTrashPrice from '@assets/icon/IconTrashPrice';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';
import ReanimatedSwipeable from './ReanimatedSwipeable';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { AnimatedButton } from '../CreatePriceScreen';
import { Colors } from '@/theme/Config';
import { moneyFormat } from '@/utils/Utilities';

interface CreatePriceNccCardProps {
  item: TypeCreatePrice;
  isSelected: boolean;
  handleDelete: (id: string) => void;
  handleSelect: (id: string) => void;
  simultaneousGesture: any;
}

const CreatePriceNccCard = memo<CreatePriceNccCardProps>(
  ({ item, isSelected, handleDelete, handleSelect, simultaneousGesture }) => {
    const [expanded, setExpanded] = useState(false);

    // SharedValue để đồng bộ chiều cao cho delete button
    const heightAction = useSharedValue(0);

    // Animate delete button theo heightAction
    const animatedDeleteStyle = useAnimatedStyle(() => ({
      height: heightAction.value,
    }));

    // onLayout gọi mỗi khi layout thay đổi (do expand/collapse)
    const onItemLayout = useCallback((e: any) => {
      const height = e.nativeEvent.layout.height - vs(1);
      heightAction.value = withTiming(height, { duration: 0 });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Xử lý expand/collapse
    const handleExpand = useCallback(() => {
      setExpanded(prev => !prev);
    }, []);

    // Phần render nút delete
    const renderRightActions = useCallback(
      (id: string) => (
        <AnimatedButton
          activeOpacity={1}
          style={[styles.deleteBtn, animatedDeleteStyle]}
          onPress={() => handleDelete(id)}>
          <IconTrashPrice />
        </AnimatedButton>
      ),
      [animatedDeleteStyle, handleDelete],
    );

    const handleSelectPress = useCallback(() => {
      handleSelect(item.id);
    }, [handleSelect, item.id]);

    const handleDetailPress = useCallback(() => {
      console.log('Đi tới chi tiết:', item.id);
    }, [item.id]);

    const formattedPrice = useMemo(
      () => `${moneyFormat(item.price, '.', '')}/${item.end}/${item.vat}`,
      [item.price, item.end, item.vat],
    );

    const detailItems = useMemo(
      () => [
        { label: 'Thời gian', value: item.time },
        { label: 'NCC', value: item.ncc },
      ],
      [item.time, item.ncc],
    );

    return (
      <ReanimatedSwipeable
        renderRightActions={() => renderRightActions(item.id)}
        simultaneousGesture={simultaneousGesture}
        onSwipe={() => {}}>
        <View
          style={[styles.itemContainer, expanded ? styles.itemExpanded : styles.itemCollapsed]}
          onLayout={onItemLayout}>
          <View style={styles.headerItem}>
            <AppBlockButton onPress={handleSelectPress} style={styles.left}>
              {isSelected ? <IconCheckBox /> : <IconUnCheckBox />}
            </AppBlockButton>

            <AppBlockButton style={styles.center} onPress={handleDetailPress}>
              <View style={styles.row}>
                <View style={styles.iconWrapper}>
                  <IconListPen />
                </View>
                <View style={styles.nameWrapper}>
                  <AppText style={styles.name}>{item.name}</AppText>
                  <View style={styles.rowStyle}>
                    <AppText style={styles.titlePrice}>Giá: </AppText>
                    <AppText style={styles.price}>{formattedPrice}</AppText>
                  </View>
                </View>
              </View>
            </AppBlockButton>

            <AppBlockButton style={styles.right} onPress={handleExpand}>
              <Icon name={expanded ? 'expand-less' : 'expand-more'} size={vs(20)} color="#999" />
            </AppBlockButton>
          </View>

          {expanded && (
            <View style={styles.expandedContent}>
              {detailItems.map(({ label, value }, idx) => (
                <View key={idx} style={styles.detailRow}>
                  <AppText style={styles.detailLabel}>{label}</AppText>
                  <AppText style={styles.detailValue}>{value}</AppText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ReanimatedSwipeable>
    );
  },
);

CreatePriceNccCard.displayName = 'CreatePriceNccCard';

export default CreatePriceNccCard;

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
    paddingVertical: vs(6),
  },
  itemCollapsed: {
    paddingVertical: vs(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowStyle: {
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
    alignItems: 'center',
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
    fontWeight: '700',
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
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  titlePrice: {
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
