import { AppText } from '@/elements/text/AppText';
import { LayoutAnimation, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { s, vs } from 'react-native-size-matters';
import Images from '../../../../../assets/image/Images';
import { useEffect, useState } from 'react';
import { getFontSize } from '@/constants';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme/Config';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconSub from '@assets/icon/IconSub';
import IconPlus from '@assets/icon/IconPlus';
import { moneyFormat } from '@/utils/Utilities';
import { navigate } from '@/navigation/RootNavigation';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { IItemInDetailPr } from '@/screens/InformationItemScreen/modal/InformationItemsModal';
import { IItemVendorPrice } from '@/screens/createPriceScreen/modal/CreatePriceModal';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import { GROUP_ROLES } from '@/screens/notificationScreen/view/NotificationScreen';

const DetailOrderItemCard = ({
  item,
  onUpdateQuantity,
  onUpdateNCC,
  onUpdatePrice,
}: {
  item: IItemInDetailPr;
  index: number;
  onUpdateQuantity: (item: IItemInDetailPr) => void;
  onUpdateNCC: (id: number, vendor: IItemVendorPrice) => void;
  onUpdatePrice?: (id: number, price: number) => void;
}) => {
  const { t } = useTranslation();
  const { infoUser } = useInfoUser();
  const [isShow, setIsShow] = useState(false);

  const [ncc, setNcc] = useState<IItemVendorPrice>({
    vendorName: item.vendorName,
  } as IItemVendorPrice);

  const handleShowDetail = () => {
    setIsShow(i => !i);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  console.log('DetailOrderItemCard ', item);
  // const onPickNcc = () => {
  //   navigate('PickNccScreen', {
  //     setNcc: (ncc: IItemSupplier) => {
  //       onUpdateQuantity({ ...item, vendor: ncc.code, vendorName: ncc.accountName });
  //     },
  //     ncc: undefined,
  //   });
  // };

  const onSetNcc = (i: IItemVendorPrice) => {
    setNcc(i);
    onUpdateNCC(item.id, {
      ...i,
      id: item.id,
      vat: i.vatCode,
      vendor: i.vendorCode,
    } as IItemVendorPrice);
  };
  const onSetPrice = async (price: number) => {
    try {
      // await onUpdatePrice?.(item.id, Number(price || 0));
    } catch (error) {}
  };
  const onPickNcc = () => {
    navigate('PickPriceFromNccScreen', {
      onSetNcc,
      ncc,
      itemCode: item.itemCode,
      onSetPrice,
    });
  };

  const onAdd = () => {
    // setCount(i => i + 1);
    onUpdateQuantity({ ...item, approvedQuantity: Number(item.approvedQuantity) + 1 });
  };
  const onSub = () => {
    if (item.approvedQuantity <= 0) {
      return;
    }
    onUpdateQuantity({ ...item, approvedQuantity: Math.max(0, Number(item.approvedQuantity) - 1) });
  };
  const isDisable =
    infoUser?.groups?.some(i => i.id === GROUP_ROLES.PR_APPROVER.TBP) &&
    infoUser?.groups.length <= 4;
  useEffect(() => {
    if (!item.approvedQuantity && item.quantity) {
      onUpdateQuantity({ ...item, approvedQuantity: item.quantity });
    }
  }, []);

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={1} onPress={handleShowDetail} style={styles.header}>
        <View style={styles.leftSection}>
          <FastImage source={Images.IconBox} style={styles.itemIcon} />
          <View style={styles.itemInfo}>
            <View style={styles.itemInfoRow}>
              <AppText numberOfLines={1} style={styles.prCodeText}>
                {item.iName}
              </AppText>
            </View>
            <View style={styles.itemInfoRow}>
              <AppText style={styles.dateText}>{t('Giá')}: </AppText>
              <AppText style={styles.dateTextEnd}>
                {`${moneyFormat(item?.price || 0, '.', ' ')} / ${item.unitName}`}
              </AppText>
            </View>
          </View>
        </View>
        <IconArrowRight
          style={{
            transform: [{ rotate: isShow ? '270deg' : '90deg' }],
          }}
        />
      </TouchableOpacity>

      {isShow && (
        <View style={styles.detailContainer}>
          <View style={styles.row}>
            <AppText style={styles.label}>{t('Số lượng')}</AppText>
            <AppText style={styles.value}>{item.quantity}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>{t('Số lượng duyệt')}</AppText>
            <View style={styles.quantityControl}>
              <TouchableOpacity onPress={onSub} style={styles.buttonSub}>
                <IconSub />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} disabled>
                <AppText style={styles.qtyValue}>{Number(item.approvedQuantity)}</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={onAdd} style={styles.buttonPlus}>
                <IconPlus />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>{t('NCC')}</AppText>
            <TouchableOpacity disabled={isDisable} onPress={onPickNcc} style={styles.nccContainer}>
              <AppText style={[styles.nccText, { marginRight: s(6) }]} numberOfLines={1}>
                {ncc.vendorName}
              </AppText>
              <IconArrowRight style={{ transform: [{ rotate: '90deg' }] }} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>{t('Số tiền duyệt')}</AppText>
            <AppText style={styles.approvedAmount}>
              {moneyFormat(item.price * item.approvedQuantity, '.', '')}
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

export default DetailOrderItemCard;

const styles = StyleSheet.create({
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
  itemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  prCodeText: {
    maxWidth: s(230),
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: '#333333',
    marginRight: s(6),
  },
  dateText: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY,
  },
  dateTextEnd: {
    fontSize: getFontSize(14),
    fontWeight: '700',
    lineHeight: vs(20),
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
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BLACK_100,
    borderRadius: 31,
  },
  buttonPlus: {
    paddingRight: s(10),
    paddingLeft: s(6),
    marginVertical: vs(11),
    borderLeftWidth: 2,
    height: vs(10),

    borderLeftColor: Colors.BLACK_200,
  },
  buttonSub: {
    paddingRight: s(6),
    paddingLeft: s(10),
    marginVertical: vs(11),
    borderRightWidth: 2,
    height: vs(10),
    justifyContent: 'center',
    borderRightColor: Colors.BLACK_200,
  },
  qtyValue: {
    fontSize: getFontSize(14),
    marginHorizontal: s(8),
    fontWeight: '600',
  },
  nccContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  nccText: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  approvedAmount: {
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  noteBox: {
    marginTop: vs(4),
    backgroundColor: '#F2F2F2',
    borderRadius: s(6),
    padding: s(10),
  },
  noteText: {
    fontSize: getFontSize(12),
    color: '#333',
  },
});
