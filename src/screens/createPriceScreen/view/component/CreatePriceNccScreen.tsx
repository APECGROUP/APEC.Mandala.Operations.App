import { StyleSheet, View } from 'react-native';
import React from 'react';
import Header from '@/screens/notificationScreen/view/component/Header';
import { useTranslation } from 'react-i18next';
import { s, vs } from 'react-native-size-matters';
import { AppText } from '@/elements/text/AppText';
import { Colors } from '@/theme/Config';
import { getFontSize } from '@/constants';
import light from '@/theme/light';
import { PaddingHorizontal } from '@/utils/Constans';
import Footer from '@/screens/filterScreen/view/component/Footer';

const CreatePriceNccScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.flex1}>
      <Header title={t('createPrice.createNcc')} iconWidth={s(40)} />

      <View style={styles.titleContainer}>
        <AppText style={styles.titleText}>{t('Danh sách gán giá NCC')}</AppText>
        <View style={styles.countBadge}>
          <AppText style={styles.countBadgeText}>{0}</AppText>
        </View>
      </View>
      <View style={styles.listContent} />

      <Footer
        onLeftAction={async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }}
        onRightAction={() => {}}
        leftButtonTitle={t('createPrice.createMoreItem')}
        rightButtonTitle={t('createPrice.saveInfo')}
      />
    </View>
  );
};

export default CreatePriceNccScreen;

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  listContent: {
    paddingHorizontal: PaddingHorizontal,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PaddingHorizontal,
    paddingVertical: vs(12),
  },
  titleText: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    color: '#333333',
  },
  countBadge: {
    marginLeft: s(8),
    backgroundColor: Colors.PRIMARY,
    borderRadius: s(4),
    paddingVertical: vs(1),
  },
  countBadgeText: {
    color: light.white,
    paddingHorizontal: s(6),
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
});
