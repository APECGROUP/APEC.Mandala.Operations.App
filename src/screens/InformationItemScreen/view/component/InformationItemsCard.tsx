import { AppText } from '@/elements/text/AppText';
import { LayoutAnimation, TextInput, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { s } from 'react-native-size-matters';
import Images from '../../../../../assets/image/Images';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IItemInDetailPr } from '../../modal/InformationItemsModal';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconSub from '@assets/icon/IconSub';
import IconPlus from '@assets/icon/IconPlus';
import { moneyFormat } from '@/utils/Utilities';
import { navigate } from '@/navigation/RootNavigation';
import { styles } from './style';
import { IItemVendorPrice } from '@/screens/createPriceScreen/modal/CreatePriceModal';

const InformationItemsCard = ({
  item,
  onFocusComment,
  onUpdatePrice,
  onUpdateNCC,
  onUpdateQuantity,
  requestDate,
}: {
  item: IItemInDetailPr;
  index: number;
  onFocusComment: () => void;
  onUpdatePrice?: (id: number, price: number) => void;
  onUpdateNCC: (id: number, vendor: IItemVendorPrice) => void;
  onUpdateQuantity: (item: IItemInDetailPr) => void;
  requestDate: string;
}) => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const initialPrice = item.price > 0 ? item.price : ''; // Khởi tạo giá trị ban đầu
  const priceRef = useRef(initialPrice); // Dùng useRef thay vì useState
  // const [isEditPrice, setIsEditPrice] = useState(item.price <= 0);

  const inputRef = useRef<TextInput>(null); // nếu cần focus programmatically

  const [ncc, setNcc] = useState<IItemVendorPrice>({
    price: item?.price,
    vendorCode: item?.vendor,
    vendorName: item?.vendorName,
  } as IItemVendorPrice);

  const handleShowDetail = () => {
    setIsShow(i => !i);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  const onSetNcc = (i: IItemVendorPrice) => {
    console.log('alo: setNCC: ', i);
    setNcc(i);
    onUpdateNCC(item.id, {
      ...i,
      id: item.id,
      vat: i.vatCode,
      vendor: i.vendorCode,
    } as IItemVendorPrice);
  };

  const onPickNcc = () => {
    navigate('PickPriceFromNccScreen', {
      onSetNcc,
      ncc,
      itemCode: item.itemCode,
      onSetPrice,
      requestDate,
    });
  };
  console.log('render: ', ncc, item);
  const onSetPrice = async (price: number) => {
    // setIsEditPrice(false);
    // console.log('giá nè: ', price);
    // try {
    //   if (priceRef.current != null) {
    //     await onUpdatePrice?.(item.id, Number(price || 0));
    //   }
    // } catch (error) {}
  };
  const onBlur = async () => {
    // setIsEditPrice(false);
    try {
      if (priceRef.current != null) {
        await onUpdatePrice?.(item.id, Number(priceRef.current || 0));
      }
    } catch (error) {}
  };

  const onResetPrice = () => {
    // setIsEditPrice(true);
    priceRef.current = '';
    inputRef.current?.setNativeProps({ text: '' });
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
  useEffect(() => {
    if (
      item.price &&
      item.price !== ncc.price &&
      item.vendorName &&
      item.vendorName !== ncc.vendorName
    ) {
      setNcc({
        price: item.price,
        vendorName: item.vendorName,
        unitName: item.unitName,
      } as IItemVendorPrice);
    }
  }, [item, ncc.price, ncc.vendorName]);
  // useEffect(() => {
  //   if (!item.approvedQuantity && item.quantity) {
  //     onUpdateQuantity({ ...item, approvedQuantity: item.quantity });
  //   }
  // }, []);

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

            {item.price >= 0 ? (
              <TouchableOpacity
                disabled
                activeOpacity={1}
                onPress={onResetPrice}
                style={styles.itemInfoRow}>
                <AppText style={styles.dateText}>{t('orderDetail.price')}: </AppText>
                <AppText style={styles.dateTextEnd}>
                  {moneyFormat(item.price, '.', '')}/{ncc.unitName || item.unitName}
                </AppText>
              </TouchableOpacity>
            ) : (
              <View style={styles.itemInfoRow}>
                <AppText style={styles.dateText}>{t('orderDetail.price')}: </AppText>
                <View style={styles.itemInfoRow}>
                  <TextInput
                    editable={false}
                    ref={inputRef}
                    // autoFocus
                    onFocus={onFocusComment}
                    onBlur={onBlur}
                    defaultValue={String(priceRef.current)}
                    keyboardType="numeric"
                    onChangeText={text => {
                      const parsed = parseFloat(text);
                      if (!isNaN(parsed)) {
                        priceRef.current = parsed;
                      }
                    }}
                    style={styles.inputPrice}
                    underlineColorAndroid="transparent"
                  />
                  <AppText style={styles.dateTextEnd}>/{item.unitName}</AppText>
                </View>
              </View>
            )}
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
            <AppText style={styles.label}>{t('orderDetail.quantity')}</AppText>
            <AppText style={styles.value}>{item.quantity}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>{t('orderDetail.numberOfApproval')}</AppText>
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
            <TouchableOpacity onPress={onPickNcc} style={styles.nccContainer}>
              <AppText style={[styles.nccText, { marginRight: s(6) }]} numberOfLines={1}>
                {ncc.vendorName}
              </AppText>
              <IconArrowRight style={{ transform: [{ rotate: '90deg' }] }} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>{t('orderDetail.moneyOfApproval')}</AppText>
            <AppText style={styles.approvedAmount}>
              {moneyFormat(Number(item.price) * item.approvedQuantity, '.', '')}
            </AppText>
          </View>
          <View>
            <AppText style={styles.label}>{t('orderDetail.reason')}</AppText>
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

export default InformationItemsCard;
