import { LayoutAnimation, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/screens/notificationScreen/view/component/Header';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/elements/text/AppText';
import { ENDPOINT, PaddingHorizontal } from '@/utils/Constans';
import { vs } from 'react-native-size-matters';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '@/navigation/params';
import AppDropdown from '@/elements/appDropdown/AppDropdown';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { moneyFormat } from '@/utils/Utilities';
import IconCalendar from '@assets/icon/IconCalendar';
import IconDropDown from '@assets/icon/IconDropDown';
import IconListPen from '@assets/icon/IconListPen';
import IconPenEdit from '@assets/icon/IconPenEdit';
import moment from 'moment';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { useAlert } from '@/elements/alert/AlertProvider';
import { IItemVat, IResponseListVat } from '../../modal/CreatePriceModal';
import { goBack, navigate } from '@/navigation/RootNavigation';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';
import api from '@/utils/setup-axios';
import Footer from '@/screens/filterScreen/view/component/Footer';
import { Colors } from '@/theme/Config';
import { styles } from './styleEditPriceNcc';

type EditPriceNCCScreenProps = NativeStackScreenProps<MainParams, 'EditPriceNCCScreen'>;

const EditPriceNCCScreen: React.FC<EditPriceNCCScreenProps> = ({ route }) => {
  const { item, onUpdateItem } = route.params;
  const { t } = useTranslation();
  const { showToast } = useAlert();

  // State lưu trữ tất cả thông tin đang chỉnh sửa
  const [editingItem, setEditingItem] = useState({ ...item });
  const [isShow, setIsShow] = useState(true);
  const [isEditPrice, setIsEditPrice] = useState(false);
  const [listVat, setListVat] = useState<IItemVat[]>([]);

  // useRef cho giá và input để tránh re-render khi gõ
  const priceRef = useRef<number | string>(item.price > 0 ? item.price : '');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Gọi API lấy danh sách VAT khi component mount
    getListVat();
  }, []);
  console.log('render: ', item, editingItem);
  // Hàm xử lý khi ấn nút lưu
  const onHandleUpdatePrice = useCallback(async () => {
    Keyboard.dismiss();
    try {
      const response = await api.put(`${ENDPOINT.EDIT_CREATE_PRICE}/${editingItem.id}`, {
        vendorCode: editingItem.vendorCode,
        itemCode: editingItem.itemCode,
        validFrom: editingItem.validFrom,
        validTo: editingItem.validTo,
        price: editingItem.price,
        vatCode: editingItem.vatCode,
      });
      console.log('response: ', response, response.status !== 200, !response.data.isSuccess);

      if (response.status !== 200) {
        throw new Error('Failed to update price');
      }

      if (!response.data.isSuccess) {
        showToast(response.data.errors[0]?.message || t('error.subtitle'), 'error');
        return;
      }

      showToast(t('createPrice.updateSuccess'), 'success');

      // Cập nhật lại item trong mảng cha với dữ liệu mới
      onUpdateItem?.(editingItem);
      goBack();
    } catch (error) {
      showToast(t('error.subtitle'), 'error');
    }
  }, [editingItem, onUpdateItem, showToast, t]);

  // Hàm lấy danh sách VAT
  const getListVat = async () => {
    try {
      const params = { pagination: { pageIndex: 1, pageSize: 50, isAll: true }, filter: {} };
      const response = await api.post<IResponseListVat>(ENDPOINT.GET_LIST_VAT, params);

      if (response.status === 200 && response.data.isSuccess) {
        setListVat(response.data.data);
      } else {
        showToast(t('error.subtitle'), 'error');
        goBack();
      }
    } catch (error) {
      showToast(t('error.subtitle'), 'error');
      goBack();
    }
  };

  const handleShowDetail = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsShow(i => !i);
  }, []);

  const onPickNcc = useCallback(() => {
    navigate('PickNccScreen', {
      setNcc: (selectedNcc: IItemSupplier) => {
        setEditingItem(prev => ({ ...prev, vendorName: selectedNcc.accountName }));
      },
      ncc: { accountName: editingItem.vendorName } as IItemSupplier,
    });
  }, [editingItem.vendorName]);

  const onPickItem = useCallback(() => {
    navigate('PickItemScreen', {
      setItem: (selectedItem: IPickItem | undefined) => {
        if (selectedItem) {
          setEditingItem(prev => ({
            ...prev,
            itemName: selectedItem.iName,
            itemCode: String(selectedItem.iCode),
            unitName: selectedItem.unitName,
          }));
        }
      },
    });
  }, []);

  const onPickTime = useCallback(() => {
    navigate('ModalPickCalendar', {
      isSingleMode: false,
      onSelectRange: (start: string, end: string) => {
        setEditingItem(prev => ({ ...prev, validFrom: start, validTo: end }));
      },
    });
  }, []);

  const onChangeVat = useCallback((itemVat: IItemVat) => {
    setEditingItem(prev => ({ ...prev, vatId: itemVat.id, vatCode: itemVat.code }));
  }, []);

  const onBlurPrice = useCallback(() => {
    setIsEditPrice(false);
    // Cập nhật giá từ ref vào state khi blur
    setEditingItem(prev => ({ ...prev, price: priceRef.current }));
  }, []);

  const resetPrice = useCallback(() => {
    setIsEditPrice(true);
    priceRef.current = '';
    inputRef.current?.setNativeProps({ text: '' });
  }, []);

  const isError = useMemo(
    () =>
      !editingItem.vendorCode ||
      !editingItem.itemCode ||
      !editingItem.validFrom ||
      !editingItem.validTo ||
      !editingItem.price ||
      !editingItem.vatCode,
    [editingItem],
  );

  return (
    <View style={styles.container}>
      <View>
        <Header primary title={t('createPrice.editPriceNCC')} />
        <View style={styles.titleContainer}>
          <AppText style={styles.titleText}>{t('createPrice.supplierPriceList')}</AppText>
        </View>
        <View
          style={[
            isError && !isShow ? styles.cardError : styles.card,
            { marginHorizontal: PaddingHorizontal },
          ]}>
          <TouchableOpacity activeOpacity={1} onPress={handleShowDetail} style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <IconListPen />
              </View>
              <View style={styles.flex1}>
                <AppBlockButton onPress={onPickItem} style={styles.blockPickName}>
                  <AppText
                    style={[editingItem?.itemName ? styles.nccText : styles.placeholder]}
                    numberOfLines={1}>
                    {editingItem?.itemName || t('createPrice.pickItem')}
                  </AppText>
                  <IconDropDown width={vs(12)} fill={Colors.TEXT_SECONDARY} />
                </AppBlockButton>

                <View style={styles.priceRow}>
                  <AppText style={styles.priceLabel}>{t('createPrice.price')}:</AppText>
                  {!isEditPrice ? (
                    <AppBlockButton style={styles.rowCenter} onPress={() => setIsEditPrice(true)}>
                      <AppText style={styles.priceValue}>
                        {moneyFormat(String(editingItem.price), '.', '')}/{editingItem.unitName}
                      </AppText>
                      <IconPenEdit style={styles.iconEdit} />
                    </AppBlockButton>
                  ) : (
                    <View style={styles.rowCenter}>
                      <TextInput
                        ref={inputRef}
                        autoFocus
                        defaultValue={String(priceRef.current)}
                        onBlur={onBlurPrice}
                        onChangeText={text => {
                          const parsed = parseFloat(text.replace(/,/g, ''));
                          if (!isNaN(parsed)) {
                            priceRef.current = parsed;
                          } else {
                            priceRef.current = '';
                          }
                        }}
                        keyboardType="numeric"
                        style={styles.priceInput}
                        placeholder=""
                      />
                      <IconPenEdit style={styles.iconEdit} />
                    </View>
                  )}
                </View>

                <View style={styles.nccRow}>
                  <AppText style={styles.priceLabel}>{t('NCC')}:</AppText>
                  <TouchableOpacity onPress={onPickNcc} style={styles.nccTouchable}>
                    <AppText
                      style={[
                        editingItem?.vendorName ? styles.nccText : styles.placeholder,
                        styles.mw85,
                      ]}
                      numberOfLines={2}>
                      {editingItem?.vendorName || t('createPrice.pickNcc')}
                    </AppText>
                    <IconDropDown width={vs(12)} fill={Colors.TEXT_SECONDARY} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <IconDropDown style={isShow ? styles.IconExtend : styles.IconNoExtend} />
          </TouchableOpacity>

          {isShow && (
            <View style={styles.detailContainer}>
              <View style={[styles.detailRow]}>
                <AppText style={styles.detailLabel}>{t('createPrice.vat')}</AppText>
                <AppDropdown
                  selectedTextStyle={styles.textSelected}
                  style={styles.dropdownStyle}
                  placeholderStyle={styles.placeholderStyle}
                  data={listVat}
                  containerStyle={styles.dropdownContainer}
                  placeholder="0"
                  value={editingItem.vatId}
                  renderRightIcon={() => (
                    <IconDropDown width={vs(12)} fill={Colors.TEXT_SECONDARY} />
                  )}
                  onChange={onChangeVat}
                  labelField="name"
                  valueField="id"
                />
              </View>
              <View style={[styles.detailRow, { marginTop: vs(10) }]}>
                <AppText style={styles.detailLabel}>{t('createPrice.timeFromTo')}</AppText>
                <TouchableOpacity style={styles.datePicker} onPress={onPickTime}>
                  <AppText
                    style={[
                      styles.placeholder,
                      editingItem.validFrom && editingItem.validTo && styles.nccText,
                    ]}>
                    {editingItem.validFrom && editingItem.validTo
                      ? `${moment(editingItem.validFrom).format('DD/MM/YYYY')} - ${moment(
                          editingItem.validTo,
                        ).format('DD/MM/YYYY')}`
                      : t('createPrice.pickTime')}
                  </AppText>
                  <IconCalendar width={vs(12)} fill={Colors.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
      <Footer
        onLeftAction={goBack}
        onRightAction={onHandleUpdatePrice}
        leftButtonTitle={t('createPrice.cancel')}
        rightButtonTitle={t('createPrice.saveInfo')}
      />
    </View>
  );
};

export default EditPriceNCCScreen;
