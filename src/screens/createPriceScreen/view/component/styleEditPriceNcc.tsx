import { getFontSize } from '@/constants';
import { PaddingHorizontal } from '@/utils/Constans';
import { StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    marginTop: vs(12),
  },
  titleText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: '#333333',
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  mw85: { maxWidth: '85%' },
  flex1: { flex: 1 },
  blockPickName: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  dropdownStyle: {
    alignItems: 'flex-end',
    flex: 1,
    paddingBottom: vs(6),
    borderBottomColor: '#F1F1F1',
    maxWidth: s(130),
  },
  dropdownContainer: {
    height: vs(150),
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
  IconNoExtend: {
    position: 'absolute',
    right: 0,
    top: 0,
    transform: [{ rotate: '180deg' }],
  },
  card: {
    marginTop: vs(12),
    backgroundColor: '#fff',
    borderRadius: s(8),
    padding: s(12),
  },
  cardError: {
    backgroundColor: '#fff',
    borderColor: '#E84545',
    borderRadius: s(8),
    padding: s(12),
    marginTop: vs(12),
    borderWidth: 1,
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
    backgroundColor: '#E6E6E6',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: vs(6),
  },
  priceLabel: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: '#888888',
    marginRight: s(4),
  },
  priceValue: {
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: '#333333',
  },
  priceInput: {
    minWidth: s(60),
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
    paddingVertical: 0,
    fontSize: getFontSize(12),
    color: '#333',
  },
  iconEdit: {
    marginLeft: s(6),
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
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: '#888888',
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
