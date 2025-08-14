import { getFontSize } from '@/constants';
import { Colors } from '@/theme/Config';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textView: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    paddingBottom: 5,
    color: '#000',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },
  error: {
    paddingVertical: 16,
  },
  button: {
    width: '90%',
    backgroundColor: Colors.PRIMARY,
    // borderRadius: 50,
    // padding: 16,
    // marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: getFontSize(16),
  },
  imageError: {},
});

export default styles;
