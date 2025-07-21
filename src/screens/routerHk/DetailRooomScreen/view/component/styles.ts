import { StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { PaddingHorizontal } from '@/utils/Constans';

export const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: vs(12),
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -s(8),
  },
  statusText: {
    fontWeight: '600',
  },
  section: {
    marginTop: vs(20),
    paddingHorizontal: PaddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingBottom: vs(8),
  },
  statusButton: {
    paddingHorizontal: s(10),
    borderRadius: s(16),
    marginHorizontal: s(6),
    marginBottom: vs(8),
    height: vs(30),
    justifyContent: 'center',
  },
});
