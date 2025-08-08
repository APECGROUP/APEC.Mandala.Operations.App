import { getFontSize } from '@/constants';
import { Colors } from '@/theme/Config';
import { StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(8),
    padding: s(12),
    paddingTop: s(0),
    marginBottom: vs(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: s(12),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: s(40),
    height: vs(40),
    borderRadius: s(8),
    marginRight: s(12),
  },
  itemInfo: {},
  itemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  prCodeText: {
    flex: 1,
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: '#333333',
    marginRight: s(6),
  },
  dateText: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY,
  },
  dateTextEnd: {
    fontSize: getFontSize(14),
    fontWeight: '700',
    // lineHeight: vs(20),
  },
  detailContainer: {
    marginTop: vs(12),
    paddingBottom: vs(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  label: {
    fontSize: getFontSize(14),
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  value: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BLACK_100,
    borderRadius: 31,
  },
  buttonPlus: {
    paddingRight: s(10),
    paddingLeft: s(6),
    marginVertical: vs(11),
    borderLeftWidth: 2,
    height: vs(10),

    borderLeftColor: Colors.BLACK_200,
  },
  buttonSub: {
    paddingRight: s(6),
    paddingLeft: s(10),
    marginVertical: vs(11),
    borderRightWidth: 2,
    height: vs(10),
    justifyContent: 'center',
    borderRightColor: Colors.BLACK_200,
  },
  qtyValue: {
    fontSize: getFontSize(14),
    marginHorizontal: s(8),
    fontWeight: '600',
  },
  nccContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  nccText: {
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  approvedAmount: {
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  noteBox: {
    marginTop: vs(4),
    backgroundColor: '#F2F2F2',
    borderRadius: s(6),
    padding: s(10),
  },
  noteText: {
    fontSize: getFontSize(12),
    color: '#333',
  },
  inputPrice: {
    minWidth: vs(50),
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
    height: vs(14),
    paddingVertical: 0,
    textAlignVertical: 'center',
    // lineHeight: vs(20),
    color: Colors.TEXT_DEFAULT,
    fontWeight: '500',
    fontSize: getFontSize(14),
  },
});
