import { getFontSize, SCREEN_WIDTH } from '@/constants';
import { Colors } from '@/theme/Config';
import light from '@/theme/light';
import { PaddingHorizontal } from '@/utils/Constans';
import { StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  buttonCreate: {
    backgroundColor: Colors.WHITE,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: PaddingHorizontal,
    paddingVertical: vs(12),
  },
  imageBackground: {
    width: SCREEN_WIDTH,
    aspectRatio: 2.66,
    justifyContent: 'space-between',
  },
  emptyImage: {
    width: s(125),
    height: s(118),
    marginBottom: vs(12),
  },
  buttonCreatePo: {
    padding: vs(8),
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
  },
  textCreatePo: {
    fontSize: getFontSize(12),
    color: Colors.WHITE,
    fontWeight: '500',
    marginLeft: s(6),
  },
  ml7: { marginLeft: s(7) },
  buttonCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonCreatePrice2: {
    position: 'absolute',
    bottom: vs(20),
    right: s(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: vs(16),
    paddingHorizontal: s(16),

    // borderBottomWidth: 1,
  },
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    aspectRatio: 2.66,
    position: 'absolute',
    zIndex: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1,
    borderColor: light.white,
    height: vs(40),
    aspectRatio: 1,
    borderRadius: vs(20),
    marginRight: s(8),
  },
  greetingContainer: {
    height: vs(40),
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: getFontSize(18),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationWrapper: {
    width: vs(32),
    height: vs(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    borderWidth: 0.5,
    borderColor: light.white,
    position: 'absolute',
    top: vs(2),
    right: s(0),
    backgroundColor: '#FF3B30',
    width: vs(16),
    height: vs(16),
    borderRadius: vs(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: getFontSize(8),
    fontWeight: '500',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    marginBottom: vs(12),
    backgroundColor: light.white,
    borderRadius: s(8),
    paddingLeft: s(12),
    height: vs(46),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(12),
    fontWeight: '500',
    paddingVertical: 0,
    paddingLeft: s(6),
  },
  filterButton: {
    borderLeftWidth: 0.3,
    borderLeftColor: '#BABABA',
    height: vs(46),
    width: vs(46),
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    marginBottom: vs(12),
    marginTop: vs(28),
  },
  titleText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: '#333333',
  },
  countBadge: {
    marginLeft: s(8),
    backgroundColor: light.primary,
    borderRadius: s(4),
    paddingVertical: vs(1),
  },
  countBadgeText: {
    color: light.white,
    paddingHorizontal: s(6),
    fontSize: getFontSize(14),
    fontWeight: '700',
  },

  listContent: {
    paddingHorizontal: PaddingHorizontal,
    paddingBottom: vs(16),
    paddingTop: vs(12),
  },
  emptyContainer: {
    flex: 1,
    marginTop: vs(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  footerLoading: {
    marginVertical: vs(12),
    alignItems: 'center',
  },
  scrollButtonBase: {
    position: 'absolute',
    alignSelf: 'center',
    width: vs(33),
    height: vs(33),
    borderRadius: vs(24),
    backgroundColor: light.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    bottom: vs(20),
  },
  rotateIcon: {
    transform: [{ rotate: '180deg' }],
  },
  containerFlashList: {
    backgroundColor: '#F2F3F5',
  },
});
