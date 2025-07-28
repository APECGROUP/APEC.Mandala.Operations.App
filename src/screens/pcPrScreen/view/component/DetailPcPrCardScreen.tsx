import { FlatList, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
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

const DetailPcPrCardScreen = ({
  route,
}: NativeStackScreenProps<MainParams, 'DetailPcPrCardScreen'>) => {
  const { item } = route.params;
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [dateCreate, setDateCreate] = useState<Date | undefined>(undefined);
  const [dateEstimate, setDateEstimate] = useState<Date | undefined>(undefined);
  const [isCoppied, setIsCoppied] = useState(false);

  const onCopy = useCallback(() => {
    Clipboard.setString(item.content);
    setIsCoppied(true);
    setTimeout(() => {
      setIsCoppied(false);
    }, 2000);
  }, [item.content]);

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
  const renderItemPo = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-shadow
    ({ item, index }: { item: any; index: number }) => (
      <AppText size={12} weight="500" pv={5} style={styles.flex1}>
        PR20240624#0001
      </AppText>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <FastImage source={Images.IconPcPr} style={styles.itemIcon} />

      <AppBlockButton onPress={onCopy} style={styles.prRow}>
        <AppText size={12} weight="500" color={light.placeholderTextColor}>
          {t('orderInfo.prNo')}:{' '}
        </AppText>
        <AppText weight="600">{item.prNo || item.content}</AppText>
        <IconCopy style={styles.copyIcon} />
      </AppBlockButton>

      <View style={styles.infoCard}>
        <RowItem
          onPress={onPressDateCreate}
          label={t('orderInfo.requestDate')}
          value={dateCreateFormatted}
          icon={<IconCalendar />}
        />
        <RowItem
          onPress={onPressDateEstimate}
          label={t('orderInfo.estimateDate')}
          value={dateEstimateFormatted}
          icon={<IconCalendar />}
        />
        <RowItem label={t('orderInfo.department')} value={item.department?.name || ''} />
        <RowItem label={t('orderInfo.location')} value={item.location?.name || ''} />
        <RowItem
          label={t('orderInfo.requester')}
          value={item.requester?.name || ''}
          icon={<IconName />}
        />
        <RowItem label={t('orderInfo.poNo')} value={''} />
        <FlatList
          numColumns={2}
          data={new Array(20).fill(0)}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItemPo}
          style={{ backgroundColor: Colors.WHITE, borderRadius: s(8), maxHeight: vs(145) }}
          showsVerticalScrollIndicator={false}
        />
        <RowItem label={t('orderInfo.note')} />
        <View style={styles.noteContainer}>
          <AppText size={12} weight="500" color={Colors.TEXT_DEFAULT}>
            {item?.note || ''}
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
  flex1: { flex: 1 },
  blockTextCoppied: {
    backgroundColor: Colors.GRAY_100,
    paddingVertical: vs(4),
    paddingHorizontal: s(10),
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
    marginTop: vs(10),
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

export default DetailPcPrCardScreen;
