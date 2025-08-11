import { AppText } from '@/elements/text/AppText';
import { LayoutAnimation, TextInput, TouchableOpacity, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useCallback, useMemo, useRef, useState } from 'react'; // Đã thêm useRef
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme/Config';
import { navigate } from '@/navigation/RootNavigation';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import IconPenEdit from '@assets/icon/IconPenEdit';
import IconCalendar from '@assets/icon/IconCalendar';
import IconListPen from '@assets/icon/IconListPen';
import { moneyFormat } from '@/utils/Utilities';
import AppBlockButton from '@/elements/button/AppBlockButton';
import moment from 'moment';
import IconDropDown from '@assets/icon/IconDropDown';
import AppDropdown from '@/elements/appDropdown/AppDropdown';
import ReanimatedSwipeable from './ReanimatedSwipeable';
import IconTrashPrice from '@assets/icon/IconTrashPrice';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAlert } from '@/elements/alert/AlertProvider';
import { IItemVat, IItemVendorPrice } from '../../modal/CreatePriceModal';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';
import { styles } from './styleCreateNewItemCard';

const CreateNewItemCard = ({
  item,
  listVat,
  onFocusComment,
  onUpdateItem,
  handleDelete,
  simultaneousGesture,
}: {
  listVat: IItemVat[];
  item: IItemVendorPrice;
  index: number;
  onFocusComment: () => void;
  onUpdateItem: (i: IItemVendorPrice) => void;
  handleDelete: (id: number) => void;
  simultaneousGesture: any;
}) => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(true);
  const [ncc, setNcc] = useState<IItemSupplier>({} as IItemSupplier);
  const [isEditPrice, setIsEditPrice] = useState(true);
  const initialPrice = item.price > 0 ? item.price : ''; // Khởi tạo giá trị ban đầu

  // Sửa: Dùng useRef thay vì useState cho price để tránh re-render khi gõ
  const priceRef = useRef(initialPrice);
  const inputRef = useRef<TextInput>(null);

  const { showAlert } = useAlert();
  console.log('list vat: ', listVat);
  const handleShowDetail = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsShow(i => !i);
  };

  const onPickNcc = () => {
    navigate('PickNccScreen', {
      setNcc: (i: IItemSupplier) => {
        setNcc(i);
        onUpdateItem({ ...item, vendorCode: String(i.code), vendorName: i.accountName });
      },
      ncc,
    });
  };

  const onBlur = async () => {
    // Sửa: Lấy giá trị từ priceRef
    setIsEditPrice(false);
    await onUpdateItem?.({ ...item, price: Number(priceRef.current || 0) });
  };

  const onPickItem = () => {
    navigate('PickItemScreen', {
      setItem: (i: IPickItem) => {
        onUpdateItem({ ...item, itemName: i.iName, itemCode: String(i.iCode) });
      },
    });
  };

  const onPickTime = () => {
    navigate('ModalPickCalendar', {
      isSingleMode: false,
      onSelectRange: (start: any, end: any) => {
        onUpdateItem({ ...item, validFrom: start, validTo: end });
      },
    });
  };

  const onChangeVat = (itemVat: IItemVat) => {
    onUpdateItem({ ...item, vatCode: itemVat.code, vatId: itemVat.id });
  };

  const isError = useMemo(
    () =>
      item.vendorCode === '' ||
      item.itemCode === '0' ||
      !item.validFrom ||
      !item.validTo ||
      !item.price ||
      item.vatCode === '',
    [item],
  );

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

  const onDelete = useCallback((id: number) => {
    showAlert(t('createPrice.remove.title'), '', [
      {
        text: t('createPrice.remove.cancel'),
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: t('createPrice.remove.agree'),
        onPress: async () => handleDelete(id),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phần render nút delete
  const renderRightActions = useCallback(
    (id: number) => (
      <TouchableOpacity
        activeOpacity={1}
        style={[!isShow ? styles.deleteBtn : styles.deleteBtnExtend, animatedDeleteStyle]}
        onPress={() => onDelete(id)}>
        <IconTrashPrice />
      </TouchableOpacity>
    ),
    [animatedDeleteStyle, isShow, onDelete],
  );

  // Sửa: Cập nhật cả priceRef và TextInput khi reset giá
  const resetPrice = () => {
    setIsEditPrice(true);
    priceRef.current = '';
    inputRef.current?.setNativeProps({ text: '' });
  };

  return (
    <ReanimatedSwipeable
      renderRightActions={() => renderRightActions(item.id!)}
      simultaneousGesture={simultaneousGesture}
      onSwipe={() => {}}>
      <View onLayout={onItemLayout} style={[isError && !isShow ? styles.cardError : styles.card]}>
        {/* Header Row */}
        <TouchableOpacity activeOpacity={1} onPress={handleShowDetail} style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <IconListPen />
            </View>
            <View style={styles.flex1}>
              <AppBlockButton onPress={onPickItem} style={styles.blockPickName}>
                <AppText
                  style={[item?.itemName ? styles.nccText : styles.placeholder]}
                  numberOfLines={1}>
                  {item?.itemName || t('createPrice.pickItem')}
                </AppText>
                <IconDropDown width={vs(12)} fill={Colors.TEXT_SECONDARY} />
              </AppBlockButton>
              <View style={styles.priceRow}>
                <AppText style={styles.priceLabel}>{t('createPrice.price')}:</AppText>
                {/* Sửa: Kiểm tra priceRef.current */}
                {!isEditPrice ? (
                  <AppBlockButton style={styles.rowCenter} onPress={resetPrice}>
                    <AppText style={styles.priceValue}>
                      {/* Sửa: Hiển thị giá trị từ priceRef */}
                      {moneyFormat(priceRef.current, '.', '')}/{'Kg'}
                    </AppText>
                    <IconPenEdit style={{ marginLeft: s(6) }} />
                  </AppBlockButton>
                ) : (
                  <View style={styles.rowCenter}>
                    <TextInput
                      autoFocus
                      ref={inputRef}
                      defaultValue={String(priceRef.current)} // Sửa: Dùng defaultValue
                      onFocus={onFocusComment}
                      onBlur={onBlur}
                      onChangeText={text => {
                        // Sửa: Cập nhật trực tiếp vào priceRef
                        const parsed = parseFloat(text);
                        if (!isNaN(parsed)) {
                          priceRef.current = parsed;
                        }
                      }}
                      keyboardType="numeric"
                      style={styles.priceInput}
                      placeholder=""
                      placeholderTextColor="#999"
                    />
                    <IconPenEdit style={{ marginLeft: s(6) }} />
                  </View>
                )}
              </View>
              <View style={styles.nccRow}>
                <AppText style={styles.priceLabel}>{t('NCC')}:</AppText>
                <TouchableOpacity onPress={onPickNcc} style={styles.nccTouchable}>
                  <AppText
                    style={[ncc?.accountName ? styles.nccText : styles.placeholder, styles.mw85]}
                    numberOfLines={2}>
                    {ncc?.accountName || t('createPrice.pickNcc')}
                  </AppText>
                  <IconDropDown width={vs(12)} fill={Colors.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <IconDropDown style={styles.IconExtend} />
        </TouchableOpacity>

        {/* Expanded Detail Section */}
        {isShow && (
          <View style={styles.detailContainer}>
            {/* <View style={styles.detailRow}>
              <AppText style={styles.detailLabel}>{t('createPrice.vat')}</AppText>
              <TouchableOpacity style={styles.touchableVat}>
                <AppText style={[styles.nccText]} numberOfLines={1}>
                  {item.vat || 0}
                </AppText>
                <IconDropDown width={vs(12)} fill={Colors.TEXT_SECONDARY} />
              </TouchableOpacity>
            </View> */}
            <View style={[styles.detailRow]}>
              <AppText style={styles.detailLabel}>{t('createPrice.vat')}</AppText>
              <AppDropdown
                selectedTextStyle={styles.textSelected}
                style={styles.dropdownStyle}
                placeholderStyle={styles.placeholderStyle}
                data={listVat}
                containerStyle={{ height: vs(150) }}
                placeholder="0"
                value={item.vatId}
                renderRightIcon={() => <IconDropDown width={vs(12)} fill={Colors.TEXT_SECONDARY} />}
                onChange={onChangeVat}
                labelField="name"
                valueField="id"
              />
            </View>

            <View style={[styles.detailRow, { marginTop: vs(10) }]}>
              <AppText style={styles.detailLabel}>{t('createPrice.timeFromTo')}</AppText>
              <TouchableOpacity style={styles.datePicker} onPress={onPickTime}>
                <AppText
                  style={[styles.placeholder, item.validFrom && item.validTo && styles.nccText]}>
                  {item.validFrom && item.validTo
                    ? `${moment(item.validFrom).format('DD/MM/YYYY')} - ${moment(
                        item.validTo,
                      ).format('DD/MM/YYYY')}`
                    : t('createPrice.pickTime')}
                </AppText>
                <IconCalendar width={vs(12)} fill={Colors.TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      {isError && !isShow && <AppText style={styles.error}>{t('createPrice.error')}</AppText>}
    </ReanimatedSwipeable>
  );
};

export default CreateNewItemCard;
