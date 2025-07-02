import { I18nManager, StyleSheet } from 'react-native';
import { ms, s, vs } from 'react-native-size-matters';
import { getFontSize } from '../../constants';

export const styles = StyleSheet.create({
  mainWrap: {
    justifyContent: 'center',
  },
  container: {
    flexShrink: 1,
    borderWidth: 0.5,
    borderColor: '#EEEEEE',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  flex1: {
    flex: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  wrapTop: {
    justifyContent: 'flex-end',
  },
  dropdown: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginVertical: vs(5),
    fontSize: getFontSize(16),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  item: {
    padding: ms(17),
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: getFontSize(12),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  icon: {
    width: vs(20),
    height: vs(20),
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#DDDDDD',
    paddingHorizontal: s(8),
    marginBottom: vs(8),
    margin: ms(6),
    height: vs(45),
  },
  fullScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
