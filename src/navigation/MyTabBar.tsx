import React, { cloneElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { vs } from 'react-native-size-matters';

// Icons và Configs
import IconTabAssignPrice from '@assets/icon/IconTab1';
import IconTabCreatePrice from '@assets/icon/IconTab2';
import IconTabCreatePo from '@assets/icon/IconTab3';
import IconTabPcPr from '@assets/icon/IconTab4';
import { Colors } from '@/theme/Config';
import light from '../theme/light';
import { AppText } from '../elements/text/AppText';
import IconTabApprovePr from '@assets/icon/IconTab6';
import { TabBarParams } from './params'; // Import TabBarParams để có kiểu dữ liệu chính xác cho tên màn hình

// Định nghĩa một mapping chung cho các chi tiết của màn hình tab (icon, labelKey)
// Điều này giúp tập trung cấu hình và tái sử dụng dễ dàng hơn.
const SCREEN_TAB_DETAILS: {
  [key in keyof TabBarParams]?: {
    icon: React.ReactElement;
    labelKey: string;
  };
} = {
  AssignPriceScreen: { icon: <IconTabAssignPrice />, labelKey: 'myTabs.assignPrice' },
  CreatePriceScreen: { icon: <IconTabCreatePrice />, labelKey: 'myTabs.createPrice' },
  ApprovePrScreen: { icon: <IconTabApprovePr />, labelKey: 'myTabs.approvePr' },
  CreatePoScreen: { icon: <IconTabCreatePo />, labelKey: 'myTabs.createPo' },
  PcPrScreen: { icon: <IconTabPcPr />, labelKey: 'myTabs.pcPr' },
};

// Hàm để lấy icon khi tab đang focus (màu PRIMARY)
const getActiveIcon = (icon: React.ReactElement) => cloneElement(icon, { fill: Colors.PRIMARY });

const MyTabBar = ({ state, descriptors, navigation }: any) => {
  const { t } = useTranslation();
  const { buildHref } = useLinkBuilder();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.row]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Lấy chi tiết tab từ mapping chung dựa trên tên route
        const tabDetails = SCREEN_TAB_DETAILS[route.name as keyof TabBarParams];

        // Nếu không tìm thấy chi tiết tab (ví dụ: route không nằm trong SCREEN_TAB_DETAILS), bỏ qua
        if (!tabDetails) {
          return null;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <PlatformPressable
            key={route.key}
            pressOpacity={1}
            href={buildHref(route.name, route.params)}
            android_ripple={{ color: 'transparent' }}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            style={[styles.button, { paddingBottom: bottom }]}>
            {/* Render icon dựa vào trạng thái focus */}
            {isFocused ? getActiveIcon(tabDetails.icon) : tabDetails.icon}
            <AppText
              numberOfLines={1}
              size={12}
              mt={4}
              style={{
                color: isFocused ? Colors.PRIMARY : Colors.TEXT_DEFAULT,
              }}>
              {t(tabDetails.labelKey)}
            </AppText>
          </PlatformPressable>
        );
      })}
    </View>
  );
};

export default MyTabBar;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: light.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: Colors.BLACK_100,
  },
  row: {
    flexDirection: 'row',
  },
});
