import { AppText } from '@/elements/text/AppText';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { s, vs } from 'react-native-size-matters';
import IconInfomation from '../../../../../assets/icon/IconInfomation';
import IconNote from '../../../../../assets/icon/IconNote';
import Images from '../../../../../assets/image/Images';
import { memo, useCallback, useMemo } from 'react';
import { getFontSize } from '@/constants';
import { useTranslation } from 'react-i18next';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { navigate } from '@/navigation/RootNavigation';
import { DataAssignPrice } from '../../modal/AssignPriceModal';
import moment from 'moment';

interface AssignPriceCardProps {
  item: DataAssignPrice;
  index: number;
}

const AssignPriceCard = memo<AssignPriceCardProps>(({ item, index }) => {
  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    navigate('InformationItemsScreen', { item });
  }, [item]);

  const handleDetailPress = useCallback(() => {
    navigate('DetailAssignPriceCardScreen', { item });
  }, [item]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={styles.card}>
      <FastImage source={Images.IconAssignPrice} style={styles.itemIcon} />
      <View style={styles.itemInfo}>
        <View style={styles.itemInfoRow}>
          <AppText numberOfLines={1} style={styles.prCodeText}>
            {item.content}
          </AppText>
          {/* <View style={styles.noteBadge}>
           <AppText style={styles.noteBadgeText}>{t('Ghi chú')}</AppText>
         </View> */}
          <IconNote />
          <AppBlockButton onPress={handleDetailPress}>
            <IconInfomation style={{ marginHorizontal: s(6) }} />
          </AppBlockButton>
        </View>
        <AppText style={styles.dateText}>
          {moment(item.createdAt).format('DD/MM/YYYY')} -{' '}
          {moment(item.estimateDate).format('DD/MM/YYYY')}
        </AppText>
        <View style={styles.blockWaiting}>
          <AppText size={12} color={'#FF7009'} weight="500">
            {t('notifications.status.waitingAssignPrice')}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
});

AssignPriceCard.displayName = 'AssignPriceCard';

export default AssignPriceCard;

const styles = StyleSheet.create({
  blockWaiting: {
    paddingVertical: vs(2),
    paddingHorizontal: s(4),
    borderRadius: s(4),
    backgroundColor: '#FFE2CE',
    alignSelf: 'flex-start',
    marginTop: vs(6),
  },
  dateText: {
    fontSize: getFontSize(12),
    fontWeight: '400',
    color: '#666666',
  },
  prCodeText: {
    maxWidth: '70%',
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: '#333333',
    marginRight: s(6),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: s(8),
    padding: s(12),
    marginBottom: vs(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'flex-start',
  },
  itemIcon: {
    width: s(40),
    height: vs(40),
    borderRadius: s(8),
    marginRight: s(12),
  },
  itemInfo: {
    flex: 1,
  },
  itemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
});
