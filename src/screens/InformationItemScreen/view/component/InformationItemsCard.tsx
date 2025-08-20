import { AppText } from '@/elements/text/AppText';
import { LayoutAnimation, TextInput, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { s } from 'react-native-size-matters';
import Images from '../../../../../assets/image/Images';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IItemInDetailPr } from '../../modal/InformationItemsModal';
import IconArrowRight from '@assets/icon/IconArrowRight';
import IconSub from '@assets/icon/IconSub';
import IconPlus from '@assets/icon/IconPlus';
import { moneyFormat } from '@/utils/Utilities';
import { navigate } from '@/navigation/RootNavigation';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { styles } from './style';
import { IItemVendorPrice } from '@/screens/createPriceScreen/modal/CreatePriceModal';

const InformationItemsCard = ({
  item,
  onFocusComment,
  onUpdatePrice,
  onUpdateNCC,
}: {
  item: IItemInDetailPr;
  index: number;
  onFocusComment: () => void;
  onUpdatePrice?: (id: number, price: number) => void;
  onUpdateNCC: (id: number, vendor: string) => void;
}) => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const [count, setCount] = useState(item.quantity);
  const initialPrice = item.price > 0 ? item.price : ''; // Khởi tạo giá trị ban đầu
  const priceRef = useRef(initialPrice); // Dùng useRef thay vì useState
  const [isEditPrice, setIsEditPrice] = useState(item.price <= 0);

  const inputRef = useRef<TextInput>(null); // nếu cần focus programmatically

  const [ncc, setNcc] = useState<IItemVendorPrice>({} as IItemVendorPrice);

  const handleShowDetail = () => {
    setIsShow(i => !i);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  const onSetNcc = (i: IItemVendorPrice) => {
    setNcc(i);
    onUpdateNCC(item.id, i.vendorCode);
  };

  const onPickNcc = () => {
    navigate('PickPriceFromNccScreen', {
      onSetNcc,
      ncc,
      itemCode: item.itemCode,
      onSetPrice,
    });
  };
  console.log('render: ', ncc, item);
  const onSetPrice = async (price: number) => {
    setIsEditPrice(false);
    console.log('giá nè: ', price);
    try {
      if (priceRef.current != null) {
        await onUpdatePrice?.(item.id, Number(price || 0));
      }
    } catch (error) {}
  };
  const onBlur = async () => {
    setIsEditPrice(false);
    try {
      if (priceRef.current != null) {
        await onUpdatePrice?.(item.id, Number(priceRef.current || 0));
      }
    } catch (error) {}
  };

  const onResetPrice = () => {
    setIsEditPrice(true);
    priceRef.current = '';
    inputRef.current?.setNativeProps({ text: '' });
  };

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

            {!isEditPrice ? (
              <TouchableOpacity
                disabled
                activeOpacity={1}
                onPress={onResetPrice}
                style={styles.itemInfoRow}>
                <AppText style={styles.dateText}>{t('orderDetail.price')}: </AppText>
                <AppText style={styles.dateTextEnd}>
                  {moneyFormat(ncc.price, '.', '')}/{ncc.unitName}
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
              <TouchableOpacity
                onPress={() => setCount(i => (i > 0 ? i - 1 : 0))}
                style={styles.buttonSub}>
                <IconSub />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} disabled>
                <AppText style={styles.qtyValue}>{count}</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCount(i => i + 1)} style={styles.buttonPlus}>
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
              {moneyFormat(Number(priceRef.current) * item.quantity, '.', '')}
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
