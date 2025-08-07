import { AppText } from '@/elements/text/AppText';
import { LayoutAnimation, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { s, vs } from 'react-native-size-matters';
import Images from '../../../../../assets/image/Images';
import { useState } from 'react';
import { getFontSize } from '@/constants';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme/Config';
import IconDropDown from '@assets/icon/IconDropDown';
import { IItemInDetailPr } from '@/screens/InformationItemScreen/modal/InformationItemsModal';

const InformationItemsPcPrCard = ({ item }: { item: IItemInDetailPr; index: number }) => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const handleShowDetail = () => {
    // console.log('onPress');
    setIsShow(i => !i);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={1} onPress={handleShowDetail} style={styles.header}>
        <View style={styles.leftSection}>
          <FastImage source={Images.IconBox} style={styles.itemIcon} />
          <View style={styles.itemInfo}>
            <AppText numberOfLines={1} style={styles.prCodeText}>
              {item.iName}
            </AppText>
            <View style={styles.center}>
              <AppText color={Colors.TEXT_SECONDARY}>{t('informationItem.unit')}:</AppText>
              <AppText weight="700" ml={6}>
                {item.unitName}
              </AppText>
            </View>
          </View>
        </View>
        <IconDropDown
          style={{
            transform: [{ rotate: isShow ? '180deg' : '0deg' }],
          }}
        />
        {/* <IconArrowRight
          style={{
            transform: [{ rotate: isShow ? '270deg' : '90deg' }],
          }}
        /> */}
      </TouchableOpacity>

      {isShow && (
        <View style={styles.detailContainer}>
          <View style={styles.row}>
            <AppText style={styles.label}>{t('orderDetail.quantity')}</AppText>
            <AppText style={styles.value}>{item.quantity}</AppText>
          </View>

          <View style={styles.row}>
            <AppText style={styles.label}>{t('orderDetail.numberOfApproval')}</AppText>
            <AppText style={styles.value}>{item.approvedQuantity}</AppText>
          </View>

          <View style={styles.row}>
            <AppText style={styles.label}>{t('orderDetail.numberOfApprovaled')}</AppText>
            <AppText style={styles.value}>{item.quantity}</AppText>
          </View>

          <View style={[styles.row]}>
            <AppText style={styles.label}>{t('NCC')}</AppText>
            <AppText style={[styles.nccText, styles.nameSupplier]} numberOfLines={2}>
              {item.vendorName}
            </AppText>
          </View>
          <View>
            <AppText style={styles.label}>{t('Ghi chú')}</AppText>
            <View style={styles.noteBox}>
              <AppText style={styles.noteText} numberOfLines={3}>
                {item.remark}
              </AppText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default InformationItemsPcPrCard;

const styles = StyleSheet.create({
  center: { flexDirection: 'row', alignItems: 'center' },
  nameSupplier: { maxWidth: '55%', textAlign: 'right' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(8),
    padding: s(12),
    paddingTop: s(0),
    marginBottom: vs(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: s(12),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: s(40),
    height: vs(40),
    borderRadius: s(8),
    marginRight: s(12),
  },
  itemInfo: {},
  prCodeText: {
    flex: 1,
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: '#333333',
    marginRight: s(6),
  },
  detailContainer: {
    marginTop: vs(12),
    paddingBottom: vs(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  label: {
    fontSize: getFontSize(14),
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  value: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  nccText: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  noteBox: {
    marginTop: vs(4),
    backgroundColor: '#F2F2F2',
    borderRadius: s(6),
    padding: s(10),
  },
  noteText: {
    fontSize: getFontSize(12),
    fontWeight: '500',
  },
});
