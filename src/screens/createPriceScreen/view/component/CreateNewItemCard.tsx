import { AppText } from '@/elements/text/AppText';
import { LayoutAnimation, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useCallback, useMemo, useState } from 'react';
import { getFontSize } from '@/constants';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/theme/Config';
import { navigate } from '@/navigation/RootNavigation';
import { IItemSupplier, ResponseNcc } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';
import IconPenEdit from '@assets/icon/IconPenEdit';
import IconCalendar from '@assets/icon/IconCalendar';
import IconListPen from '@assets/icon/IconListPen';
import { moneyFormat } from '@/utils/Utilities';
import AppBlockButton from '@/elements/button/AppBlockButton';
import moment from 'moment';
import IconDropDown from '@assets/icon/IconDropDown';
import AppDropdown from '@/elements/appDropdown/AppDropdown';
import ReanimatedSwipeable from './ReanimatedSwipeable';
import { AnimatedButton } from '../CreatePriceScreen';
import IconTrashPrice from '@assets/icon/IconTrashPrice';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAlert } from '@/elements/alert/AlertProvider';

const CreateNewItemCard = ({
  item,
  onFocusComment,
  onUpdateItem,
  handleDelete,
  simultaneousGesture,
}: {
  item: IPickItem;
  index: number;
  onFocusComment: () => void;
  onUpdateItem: (i: IPickItem) => void;
  handleDelete: (id: string) => void;
  simultaneousGesture: any;
}) => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(true);
  const [ncc, setNcc] = useState<IItemSupplier>(item.supplier);
  const [price, setPrice] = useState(item.price);
  const { showAlert } = useAlert();

  const handleShowDetail = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsShow(i => !i);
  };

  const onPickNcc = () => {
    navigate('PickNccScreen', {
      setNcc: setNcc,
      ncc: item.supplier,
    });
  };

  const onBlur = async () => {
    await onUpdateItem?.({ ...item, price });
  };

  const onPickItem = () => {
    navigate('PickItemScreen', {
      setItem: (i: { id: string; name: string }) => {
        onUpdateItem({ ...item, name: i.name, supplier: { id: i.id, name: i.name } });
      },
    });
  };

  const onPickTime = () => {
    navigate('ModalPickCalendar', {
      isSingleMode: false,
      onSelectRange: (start: any, end: any) => {
        onUpdateItem({ ...item, dateFrom: start, dateTo: end });
      },
    });
  };

  const onChangeVat = (itemVat: { id: string; name: string }) => {
    onUpdateItem({ ...item, vat: { id: itemVat.id, name: itemVat.name } });
  };

  const isError = useMemo(
    () =>
      item.name === '' ||
      item.price === 0 ||
      item.supplier.name === '' ||
      item.vat === '' ||
      item.dateFrom === '' ||
      item.dateTo === '',
    [item],
  );

  const listVat = [
    { id: '1', name: '10' },
    { id: '2', name: '15' },
    { id: '3', name: '20' },
    { id: '4', name: '25' },
    { id: '5', name: '30' },
    { id: '6', name: '35' },
    { id: '7', name: '40' },
    { id: '8', name: '45' },
    { id: '9', name: '50' },
    { id: '10', name: '55' },
    { id: '11', name: '60' },
  ];

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

  const onDelete = useCallback((id: string) => {
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
    (id: string) => (
      <AnimatedButton
        activeOpacity={1}
        style={[!isShow ? styles.deleteBtn : styles.deleteBtnExtend, animatedDeleteStyle]}
        onPress={() => onDelete(id)}>
        <IconTrashPrice />
      </AnimatedButton>
    ),
    [animatedDeleteStyle, isShow, onDelete],
  );

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
                  style={[item?.name ? styles.nccText : styles.placeholder]}
                  numberOfLines={1}>
                  {item?.name || t('createPrice.pickItem')}
                </AppText>
                <IconDropDown width={vs(12)} fill={Colors.TEXT_SECONDARY} />
              </AppBlockButton>
              <View style={styles.priceRow}>
                <AppText style={styles.priceLabel}>{t('createPrice.price')}:</AppText>
                {item.price ? (
                  <AppText style={styles.priceValue}>
                    {moneyFormat(item.price, '.', '')}/{item.end || 'Kg'}
                  </AppText>
                ) : (
                  <TextInput
                    // value={price?.toString()}
                    onFocus={onFocusComment}
                    onBlur={onBlur}
                    onChangeText={text => setPrice(Number(text))}
                    keyboardType="numeric"
                    style={styles.priceInput}
                    placeholder="0"
                    placeholderTextColor="#999"
                  />
                )}
                {/* <AppText style={styles.unitText}>/{item.end || 'Kg'}</AppText> */}
                <IconPenEdit style={{ marginLeft: s(6) }} />
              </View>
              <View style={styles.nccRow}>
                <AppText style={styles.priceLabel}>{t('NCC')}:</AppText>
                <TouchableOpacity onPress={onPickNcc} style={styles.nccTouchable}>
                  <AppText
                    style={[ncc?.name ? styles.nccText : styles.placeholder, styles.mw85]}
                    numberOfLines={2}>
                    {ncc?.name || t('createPrice.pickNcc')}
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
            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel}>{t('createPrice.vat')}</AppText>
              <AppDropdown
                selectedTextStyle={styles.textSelected}
                style={styles.dropdownStyle}
                placeholderStyle={styles.placeholderStyle}
                data={listVat}
                containerStyle={{ height: vs(150), width: s(50) }}
                placeholder="0"
                value={item.vat}
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
                  style={[styles.placeholder, item.dateFrom && item.dateTo && styles.nccText]}>
                  {item.dateFrom && item.dateTo
                    ? `${moment(item.dateFrom).format('DD/MM/YYYY')} - ${moment(item.dateTo).format(
                        'DD/MM/YYYY',
                      )}`
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

const styles = StyleSheet.create({
  mw85: { maxWidth: '85%' },
  flex1: { flex: 1 },
  blockPickName: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  dropdownStyle: {
    paddingBottom: vs(6),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    width: s(40),
  },
  placeholderStyle: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: '#333',
  },
  textSelected: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: '#333',
  },
  IconExtend: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  deleteBtn: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: s(50),
    borderRadius: s(8),
    marginTop: vs(-12),
  },
  deleteBtnExtend: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: s(50),
    borderRadius: s(8),
    marginTop: vs(12),
  },
  error: {
    color: Colors.ERROR_600,
    fontSize: getFontSize(12),
    fontWeight: '500',
    marginTop: vs(8),
    textAlign: 'right',
  },
  // touchableVat: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingBottom: vs(12),
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#F1F1F1',
  //   // flexShrink: 1,
  // },
  card: {
    marginTop: vs(12),
    backgroundColor: '#fff',
    borderRadius: s(8),
    padding: s(12),
  },
  cardError: {
    backgroundColor: '#fff',
    // borderWidth: 1,
    borderColor: Colors.ERROR_600,
    borderRadius: s(8),
    padding: s(12),
    marginTop: vs(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconBox: {
    width: s(42),
    height: s(42),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(42),
    marginRight: s(6),
    backgroundColor: Colors.BUTTON_DISABLED,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: vs(6),
  },
  priceLabel: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY,
    marginRight: s(4),
  },
  priceValue: {
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: Colors.TEXT_DEFAULT,
  },
  priceInput: {
    minWidth: s(60),
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
    paddingVertical: 0,
    fontSize: getFontSize(12),
    color: '#333',
  },
  nccRow: {
    flexDirection: 'row',
  },
  nccTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'flex-start',
    flexShrink: 1,
    width: '100%',
  },
  nccText: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    marginRight: s(4),
    color: '#333',
  },
  detailContainer: {
    paddingTop: vs(12),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    // width: s(200),
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    gap: s(4),
  },
  placeholder: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: '#BABABA',
  },
});
