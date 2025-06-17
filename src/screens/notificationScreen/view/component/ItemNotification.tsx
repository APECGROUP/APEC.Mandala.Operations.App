import {StyleSheet, View} from 'react-native';
import React from 'react';
// import {Menu} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {s, vs} from 'react-native-size-matters';
import {getFontSize} from '../../../../constants';
import {AppText} from '../../../../elements/text/AppText';
import light from '../../../../theme/light';
import {ContentNotification} from '../../../../interface/Notification.interface';
import {PaddingHorizontal} from '../../../../utils/Constans';
import AppBlockButton from '../../../../elements/button/AppBlockButton';
import IconWaitingChiefAccountantApproval from '../../../../../assets/icon/IconWaitingChiefAccountantApproval';
import IconWaitingAssignPrice from '../../../../../assets/icon/IconWaitingAssignPrice';
import IconWaitingDeptHeadApproval from '../../../../../assets/icon/IconWaitingDeptHeadApproval';
import IconWaitingGMOMApproval from '../../../../../assets/icon/IconWaitingGMOMApproval';
type props = {
  item: ContentNotification;
  onDetail: (id: number) => void;
  toggleRead: (id: number) => void;
  handleDelete: (id: number) => void;
};
const ItemNotification = ({item, onDetail}: props) => {
  const {t} = useTranslation();
  const status = item.id % 4;
  const getIcon = () => {
    switch (status) {
      case 1:
        return <IconWaitingAssignPrice />;
      case 2:
        return <IconWaitingChiefAccountantApproval />;
      case 3:
        return <IconWaitingDeptHeadApproval />;

      default:
        return <IconWaitingGMOMApproval />;
    }
  };
  return (
    <AppBlockButton
      onPress={() => onDetail(item.id)}
      style={[styles.button, {paddingHorizontal: PaddingHorizontal}]}>
      {getIcon()}
      <View style={{width: s(275), marginLeft: s(9)}}>
        <AppText
          numberOfLines={1}
          style={{
            fontSize: getFontSize(14),
            fontWeight: '700',
            color: '#000000',
          }}>
          {item.title}
        </AppText>
        <AppText
          numberOfLines={2}
          style={{
            fontSize: getFontSize(14),
            fontWeight: '500',
            color: '#000000',
          }}>
          {item.body}
        </AppText>
      </View>
      <View
        style={{
          width: s(10),
          height: s(10),
          borderRadius: s(10),
          backgroundColor: '#0059CB',
        }}
      />
    </AppBlockButton>
  );
};

export default ItemNotification;

const styles = StyleSheet.create({
  styleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  colorInFocus: {
    padding: vs(10),

    color: light.inputBorder,
  },
  colorPrimary: {
    padding: vs(10),
    color: light.primary,
  },
  button: {
    borderBottomWidth: 0.2,
    borderColor: '#F1F1F1',
    flexDirection: 'row',
    paddingVertical: vs(12),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
