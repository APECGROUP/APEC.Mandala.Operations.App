// import light from '@vn.starlingtech/theme/light'
// import { sizes } from '@vn.starlingtech/theme/theming'
import { StyleSheet } from 'react-native';
import light from '../../theme/light';
import { s, vs } from 'react-native-size-matters';
import { getFontSize } from '../../constants';

export default StyleSheet.create({
  appInputEye: {
    paddingRight: s(55),
  },
  colorRed: { color: light.danger },
  disabled: {},
  // disabled: {backgroundColor: light.disabled},
  eye: {
    alignItems: 'flex-end',

    height: vs(40),
    justifyContent: 'center',
    // position: 'absolute',
    // right: 0,
    width: s(25),
    // backgroundColor: 'red',
  },
  helperTxt: {
    color: light.danger,
    fontSize: getFontSize(12),
    fontWeight: '500',
    lineHeight: 16,
    marginHorizontal: 1,
    marginTop: vs(6),
  },
  inline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inlineLabel: { width: 122 },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    paddingLeft: s(8),
    fontSize: getFontSize(14),
    fontWeight: '500',
    // borderColor:light
  },
  inputDisabled: { backgroundColor: light.inputDisabled },
  inputError: {
    borderColor: light.danger,
  },
  inputView: {
    alignItems: 'center',
    borderColor: light.inputBorder,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    height: vs(40),
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: 0,
    maxWidth: 600,
    paddingBottom: 0,
    paddingHorizontal: s(10),
    paddingTop: 0,
    width: '100%',
  },
  item: { width: '100%' },
  itemInputInLine: { flexDirection: 'row', width: 120 },
  labelContainer: { flexDirection: 'row', marginBottom: 8 },
  radius5: { borderRadius: 5, paddingHorizontal: s(7) },
  textErr: {
    color: light.danger,
    marginTop: vs(5),
    textAlign: 'left',
  },
  dropdownFocus: {
    height: 50,
    width: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: light.primary_3,
    marginTop: 8,
  },
  dropdown: {
    height: 50,
    width: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C2C2C2',
    marginTop: 8,
  },
});
