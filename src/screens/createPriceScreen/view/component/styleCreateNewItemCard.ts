import { getFontSize } from '@/constants';
import { Colors } from '@/theme/Config';
import { StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';
export const styles = StyleSheet.create({
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
    // borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    // width: vs(40),
    maxWidth: s(130),
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
  deleteBtn: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: s(50),
    borderRadius: s(8),
    marginTop: vs(12),
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
