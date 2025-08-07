import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState, useCallback, useMemo, memo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainParams } from '@/navigation/params';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { s, vs } from 'react-native-size-matters';
import { AppText } from '@/elements/text/AppText';
import light from '@/theme/light';
import AppBlockButton from '@/elements/button/AppBlockButton';
import Clipboard from '@react-native-clipboard/clipboard';
import IconName from '@assets/icon/IconName';
import IconCalendar from '@assets/icon/IconCalendar';
import IconCopy from '@assets/icon/IconCopy';
import Images from '@assets/image/Images';
import { Colors } from '@/theme/Config';
import { navigate } from '@/navigation/RootNavigation';
import moment from 'moment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RowItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

const RowItem = memo<RowItemProps>(({ label, value, icon, onPress }) => (
  <View style={styles.rowItem}>
    <AppText weight="500" size={14} color={Colors.TEXT_SECONDARY}>
      {label}
    </AppText>
    <TouchableOpacity onPress={onPress} activeOpacity={1} style={styles.valueContainer}>
      {icon && <View style={styles.icon}>{icon}</View>}
      {value && <AppText weight="700">{value}</AppText>}
    </TouchableOpacity>
  </View>
));

RowItem.displayName = 'RowItem';

const DetailAssignPriceCardScreen = ({
  route,
}: NativeStackScreenProps<MainParams, 'DetailAssignPriceCardScreen'>) => {
  const { item } = route.params;
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [dateCreate, setDateCreate] = useState<Date | undefined>(item?.prDate);
  const [dateEstimate, setDateEstimate] = useState<Date | undefined>(item?.expectedDate);
  const [isCoppied, setIsCoppied] = useState(false);

  const onCopy = useCallback(() => {
    Clipboard.setString(item?.poNo || '');
    setIsCoppied(true);
    setTimeout(() => {
      setIsCoppied(false);
    }, 2000);
  }, [item.poNo]);

  const onPressDateCreate = useCallback(() => {
    navigate('ModalPickCalendar', {
      isSingleMode: true,
      onSelectDate: setDateCreate,
    });
  }, []);

  const onPressDateEstimate = useCallback(() => {
    navigate('ModalPickCalendar', {
      isSingleMode: true,
      onSelectDate: setDateEstimate,
    });
  }, []);

  const formatDate = useCallback((date: Date | undefined) => moment(date).format('DD/MM/YYYY'), []);

  const dateCreateFormatted = useMemo(() => formatDate(dateCreate), [dateCreate, formatDate]);
  const dateEstimateFormatted = useMemo(() => formatDate(dateEstimate), [dateEstimate, formatDate]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <FastImage source={Images.IconAssignPrice} style={styles.itemIcon} />

      <AppBlockButton onPress={onCopy} style={styles.prRow}>
        <AppText size={12} weight="500" color={light.placeholderTextColor}>
          {t('orderInfo.prNo')}:{' '}
        </AppText>
        <AppText weight="600">{item.prNo}</AppText>
        <IconCopy style={styles.copyIcon} />
      </AppBlockButton>

      <View style={styles.infoCard}>
        <RowItem
          onPress={onPressDateCreate}
          label={t('orderInfo.createDate')}
          value={dateCreateFormatted}
          icon={<IconCalendar />}
        />
        <RowItem
          onPress={onPressDateEstimate}
          label={t('orderInfo.estimateDate')}
          value={dateEstimateFormatted}
          icon={<IconCalendar />}
        />
        <RowItem label={t('orderInfo.department')} value={item?.departmentName || ''} />
        <RowItem label={t('orderInfo.location')} value={item?.storedName || ''} />
        <RowItem
          label={t('orderInfo.requester')}
          value={item.requestBy || ''}
          icon={<IconName />}
        />
        <RowItem label={t('orderInfo.note')} />
        <View style={styles.noteContainer}>
          <AppText size={12} weight="500" color={Colors.TEXT_DEFAULT}>
            {item?.description || ''}
          </AppText>
        </View>
      </View>
      {isCoppied && (
        <View style={[styles.blockTextCoppied, { bottom: bottom + 70 }]}>
          <AppText size={14} weight="500" color={Colors.TEXT_DEFAULT}>
            Đã sao chép
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  blockTextCoppied: {
    backgroundColor: Colors.GRAY_100,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: s(3),
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: light.white,
  },
  itemIcon: {
    width: s(70),
    height: vs(70),
    marginVertical: vs(10),
    borderRadius: s(185),
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: vs(8),
    paddingHorizontal: s(16),
  },
  copyIcon: {
    marginLeft: s(6),
  },
  infoCard: {
    marginTop: vs(16),
    backgroundColor: '#FAFAFA',
    borderRadius: s(12),
    padding: s(16),
    width: '100%',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(2),
    // marginBottom: vs(8),
  },
  valueContainer: {
    minWidth: '60%',
    // paddingVertical: vs(4),
    justifyContent: 'flex-end',
    height: vs(24),
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: s(6),
  },
  noteContainer: {
    backgroundColor: '#F1F1F1',
    padding: s(12),
    borderRadius: s(8),
  },
});

export default DetailAssignPriceCardScreen;
