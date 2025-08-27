/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { s, vs } from 'react-native-size-matters';
import { getFontSize } from '../../../../constants';
import { AppText } from '../../../../elements/text/AppText';
import { IItemNotification } from '../../modal/notificationModel';
import { PaddingHorizontal } from '../../../../utils/Constans';
import AppBlockButton from '../../../../elements/button/AppBlockButton';
import IconWaitingChiefAccountantApproval from '../../../../../assets/icon/IconWaitingChiefAccountantApproval';
import IconWaitingAssignPrice from '../../../../../assets/icon/IconWaitingAssignPrice';
import IconWaitingDeptHeadApproval from '../../../../../assets/icon/IconWaitingDeptHeadApproval';
import IconWaitingGMOMApproval from '../../../../../assets/icon/IconWaitingGMOMApproval';
import { Colors } from '@/theme/Config';
import Utilities from '@/utils/Utilities';
import IconCreatePo from '@assets/icon/IconCreatedPo';
import IconRejectPo from '@assets/icon/IconRejectPo';
import IconWaitingCreatePo from '@assets/icon/IconWaitingCreatePo';
type props = {
  item: IItemNotification;
  onDetail: (id: number) => void;
  toggleRead: (id: number) => void;
  handleDelete: (id: number) => void;
};
const ItemNotification = ({ item, onDetail }: props) => {
  const getIcon = () => {
    switch (item.status) {
      case 'PA': //Chờ KTT duyệt
        return <IconWaitingChiefAccountantApproval />;
      case 'PM': //Chờ TBP duyệt
        return <IconWaitingDeptHeadApproval />;
      case 'PC': //Chờ GM/OM duyệt
        return <IconWaitingGMOMApproval />;
      case 'PP': //pp Chờ gán giá
        return <IconWaitingAssignPrice />;
      case 'RJ': //RJ Từ chối
        return <IconRejectPo />;
      case 'PO': //Chờ tạo PO
        return <IconWaitingCreatePo />;
      default: //pp
        return <IconCreatePo />;
    }
  };
  return (
    <AppBlockButton
      onPress={() => onDetail(item.id)}
      style={[
        styles.button,
        {
          paddingHorizontal: PaddingHorizontal,
          backgroundColor: !item.isRead ? Colors.BLACK_100 : 'white',
        },
      ]}>
      {getIcon()}
      <View style={{ width: s(275), marginLeft: s(9) }}>
        <AppText numberOfLines={1} style={styles.title}>
          {item?.title || Utilities.getStatusName(item.status)}
        </AppText>
        <AppText numberOfLines={2} style={styles.body}>
          {item.message}
        </AppText>
      </View>
      <View
        style={[styles.dotBlue, { backgroundColor: !item.isRead ? '#0059CB' : 'transparent' }]}
      />
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
