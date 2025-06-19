import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainParams} from '@/navigation/params';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {s, vs} from 'react-native-size-matters';
import {AppText} from '@/elements/text/AppText';
import light from '@/theme/light';
import AppBlockButton from '@/elements/button/AppBlockButton';
import Clipboard from '@react-native-clipboard/clipboard';
import IconName from '@assets/icon/IconName';
import IconCalendar from '@assets/icon/IconCalendar';
import IconCopy from '@assets/icon/IconCopy';
import Images from '@assets/image/Images';
import {Colors} from '@/theme/Config';
import {navigate} from '@/navigation/RootNavigation';
import moment from 'moment';

interface RowItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

const RowItem: React.FC<RowItemProps> = ({label, value, icon, onPress}) => (
  <View style={styles.rowItem}>
    <AppText weight="500" size={14} color={Colors.TEXT_SECONDARY}>
      {label}
    </AppText>
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.valueContainer}>
      {icon && <View style={styles.icon}>{icon}</View>}
      {value && <AppText weight="700">{value}</AppText>}
    </TouchableOpacity>
  </View>
);

const DetailAssignPriceCardScreen = ({
  route,
}: NativeStackScreenProps<MainParams, 'DetailAssignPriceCardScreen'>) => {
  const {item} = route.params;
  const {t} = useTranslation();
  const [dateCreate, setDateCreate] = useState<Date | undefined>(undefined);
  const [dateEstimate, setDateEstimate] = useState<Date | undefined>(undefined);

  const onCopy = useCallback(() => {
    Clipboard.setString(item.content);
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

  return (
    <View style={styles.container}>
      <FastImage source={Images.IconAssignPrice} style={styles.itemIcon} />

      <AppBlockButton onPress={onCopy} style={styles.prRow}>
        <AppText size={12} weight="500" color={light.placeholderTextColor}>
          {t('orderInfo.prNo')}:{' '}
        </AppText>
        <AppText weight="600">{item.content}</AppText>
        <IconCopy style={styles.copyIcon} />
      </AppBlockButton>

      <View style={styles.infoCard}>
        <RowItem
          onPress={onPressDateCreate}
          label={t('orderInfo.createDate')}
          value={formatDate(dateCreate)}
          icon={<IconCalendar />}
        />
        <RowItem
          onPress={onPressDateEstimate}
          label={t('orderInfo.estimateDate')}
          value={formatDate(dateEstimate)}
          icon={<IconCalendar />}
        />
        <RowItem
          label={t('orderInfo.department')}
          value="01023-House Keeping"
        />
        <RowItem label={t('orderInfo.location')} value="Stock-CAKE SHOP" />
        <RowItem
          label={t('orderInfo.requester')}
          value="Nguyễn Văn A"
          icon={<IconName />}
        />
        <RowItem label={t('orderInfo.note')} />
        <View style={styles.noteContainer}>
          <AppText size={12} weight="500" color={Colors.TEXT_DEFAULT}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: vs(8),
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
    marginBottom: vs(8),
  },
  valueContainer: {
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
