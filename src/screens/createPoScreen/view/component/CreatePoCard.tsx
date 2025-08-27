import React, { useCallback, useMemo, memo } from 'react';
import { View } from 'react-native';
import { s, ScaledSheet, vs } from 'react-native-size-matters';
import { IItemCreatePo } from '../../modal/CreatePoModal';
import { getFontSize } from '@/constants';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { AppText } from '@/elements/text/AppText';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';
import { Colors } from '@/theme/Config';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import Images from '@assets/image/Images';
import moment from 'moment';

interface CreatePoCardProps {
  item: IItemCreatePo;
  isSelected: boolean;
  handleSelect: (id: string) => void;
}

const CreatePoCard = memo<CreatePoCardProps>(({ item, isSelected, handleSelect }) => {
  const { t } = useTranslation();
  // onLayout gọi mỗi khi layout thay đổi (do expand/collapse)

  // Phần render nút delete

  const handleSelectPress = useCallback(() => {
    handleSelect(item.id);
  }, [handleSelect, item.id]);

  const detailItems = useMemo(
    () => [
      {
        label: t('CreatePo.requester'),
        value: item.userRequest?.displayName,
      },
      { label: t('CreatePo.department'), value: item?.departmentName },
    ],
    [t, item.userRequest?.displayName, item?.departmentName],
  );
  return (
    <AppBlockButton onPress={handleSelectPress} style={[styles.itemContainer, styles.itemExpanded]}>
      <View style={styles.headerItem}>
        <View style={styles.left}>{isSelected ? <IconCheckBox /> : <IconUnCheckBox />}</View>

        <View style={styles.center}>
          <View style={styles.row}>
            {/* <View style={styles.iconWrapper}>
              <IconListPen />
            </View> */}
            <FastImage source={Images.IconCreatePo} style={styles.iconWrapper} />
            <View style={styles.nameWrapper}>
              <AppText numberOfLines={1} style={styles.name}>
                {item.prNo}
              </AppText>
              <View style={styles.row}>
                <AppText style={styles.titlePrice}>
                  {moment(item.prDate).format('DD/MM/YYYY')} -{' '}
                  {moment(item.expectedDate).format('DD/MM/YYYY')}
                </AppText>
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
    </AppBlockButton>
  );
});

CreatePoCard.displayName = 'CreatePoCard';

export default CreatePoCard;

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
