import { AppText } from '@/elements/text/AppText';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { s, vs } from 'react-native-size-matters';
import IconInfomation from '../../../../../assets/icon/IconInfomation';
import Images from '../../../../../assets/image/Images';
import { getFontSize } from '@/constants';
import { useTranslation } from 'react-i18next';
import AppBlockButton from '@/elements/button/AppBlockButton';
import { navigate } from '@/navigation/RootNavigation';
import { TypeApprove } from '../../modal/ApproveModal';
import IconCheckBox from '@assets/icon/IconCheckBox';
import IconUnCheckBox from '@assets/icon/IconUnCheckBox';

const ApproveCard = ({
  item,
  index,
  isSelected,
  handleSelect,
}: {
  item: TypeApprove;
  index: number;
  isSelected: boolean;
  handleSelect: (id: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.card}>
      <AppBlockButton
        onPress={() => {
          handleSelect(item.id);
        }}
        style={{ paddingRight: s(10) }}>
        {/* <AppBlockButton onPress={() => handleSelect(item.id)} style={{ paddingRight: s(10) }}> */}
        {isSelected ? <IconCheckBox /> : <IconUnCheckBox />}
      </AppBlockButton>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigate('DetailOrderApproveScreen', { item })}
        style={styles.buttonDetailOrder}>
        <FastImage source={Images.IconApproved} style={styles.itemIcon} />
        <View style={styles.itemInfo}>
          <View style={styles.itemInfoRow}>
            <AppText numberOfLines={1} style={styles.prCodeText}>
              {item.content}
            </AppText>
            <AppBlockButton onPress={() => navigate('DetailApproveCardScreen', { item })}>
              <IconInfomation style={{ marginHorizontal: s(0) }} />
            </AppBlockButton>
          </View>
          <AppText style={styles.dateText}>{item.user.name}</AppText>
          {index % 3 === 0 && (
            <View style={styles.noAssign}>
              <AppText size={12} color={'#FF7009'} weight="500">
                {t('Chờ gắn giá')}
              </AppText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ApproveCard;

const styles = StyleSheet.create({
  buttonDetailOrder: { flexDirection: 'row', alignItems: 'center' },
  noAssign: {
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
    alignItems: 'center',
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
