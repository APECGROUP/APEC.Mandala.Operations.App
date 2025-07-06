/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import React from 'react';
// import {Menu} from 'react-native-paper';
// import { useTranslation } from 'react-i18next';
import { s, vs } from 'react-native-size-matters';
import { getFontSize } from '../../../../constants';
import { AppText } from '../../../../elements/text/AppText';
import { ContentNotification } from '../../modal/notificationModel';
import { PaddingHorizontal } from '../../../../utils/Constans';
import AppBlockButton from '../../../../elements/button/AppBlockButton';
import IconWaitingChiefAccountantApproval from '../../../../../assets/icon/IconWaitingChiefAccountantApproval';
import IconWaitingAssignPrice from '../../../../../assets/icon/IconWaitingAssignPrice';
import IconWaitingDeptHeadApproval from '../../../../../assets/icon/IconWaitingDeptHeadApproval';
import IconWaitingGMOMApproval from '../../../../../assets/icon/IconWaitingGMOMApproval';
import { Colors } from '@/theme/Config';
import { useTranslation } from 'react-i18next';
type props = {
  item: ContentNotification;
  onDetail: (id: number) => void;
  toggleRead: (id: number) => void;
  handleDelete: (id: number) => void;
};
const ItemNotification = ({ item, onDetail }: props) => {
  const { t } = useTranslation();
  const status = item.id % 4;
  const getIcon = () => {
    switch (status) {
      case 2:
        return <IconWaitingChiefAccountantApproval />;
      case 1:
        return <IconWaitingDeptHeadApproval />;

      case 3:
        return <IconWaitingGMOMApproval />;
      default:
        return <IconWaitingAssignPrice />;
    }
  };
  return (
    <AppBlockButton
      onPress={() => onDetail(item.id)}
      style={[
        styles.button,
        {
          paddingHorizontal: PaddingHorizontal,
          backgroundColor: !item.read ? Colors.BLACK_100 : 'white',
        },
      ]}>
      {getIcon()}
      <View style={{ width: s(275), marginLeft: s(9) }}>
        <AppText numberOfLines={1} style={styles.title}>
          {item.title}
        </AppText>
        <AppText numberOfLines={2} style={styles.body}>
          {t('notifications.youHave')} {item.prNo} {item.content}
        </AppText>
      </View>
      <View style={[styles.dotBlue, { backgroundColor: !item.read ? '#0059CB' : 'transparent' }]} />
    </AppBlockButton>
  );
};

export default ItemNotification;

const styles = StyleSheet.create({
  button: {
    borderBottomWidth: 0.2,
    borderColor: '#F1F1F1',
    flexDirection: 'row',
    paddingVertical: vs(12),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: getFontSize(14),
    fontWeight: '700',
    color: '#000000',
  },
  body: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: '#000000',
  },
  dotBlue: {
    width: s(10),
    height: s(10),
    borderRadius: s(10),
    backgroundColor: '#0059CB',
  },
});
