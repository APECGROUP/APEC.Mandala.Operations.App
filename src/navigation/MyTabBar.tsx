import React, { cloneElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { vs } from 'react-native-size-matters';

// Icons và Configs
import IconTab1 from '@assets/icon/IconTab1';
import IconTab2 from '@assets/icon/IconTab2';
import IconTab3 from '@assets/icon/IconTab3';
import IconTab4 from '@assets/icon/IconTab4';
import { Colors } from '@/theme/Config';
import light from '../theme/light';
import { AppText } from '../elements/text/AppText';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import IconTab6 from '@assets/icon/IconTab6';

// Định nghĩa các hằng số cho ID nhóm người dùng
const GROUP_IDS = {
  GROUP_A: [10, 14],
  GROUP_B: [12, 13],
};

// Cấu hình icons và labels cho từng nhóm, sử dụng một cấu trúc dữ liệu tường minh hơn
const tabIconConfigs = {
  groupA: [
    { icon: <IconTab1 />, labelKey: 'myTabs.tab1' },
    { icon: <IconTab2 />, labelKey: 'myTabs.tab2' },
    { icon: <IconTab6 />, labelKey: 'myTabs.tab6' },
    { icon: <IconTab3 />, labelKey: 'myTabs.tab3' },
    { icon: <IconTab4 />, labelKey: 'myTabs.tab4' },
  ],
  groupB: [
    { icon: <IconTab6 />, labelKey: 'myTabs.tab6' },
    { icon: <IconTab4 />, labelKey: 'myTabs.tab4' },
  ],
  default: [
    { icon: <IconTab1 />, labelKey: 'myTabs.tab1' },
    { icon: <IconTab2 />, labelKey: 'myTabs.tab2' },
    { icon: <IconTab3 />, labelKey: 'myTabs.tab3' },
    { icon: <IconTab4 />, labelKey: 'myTabs.tab4' },
  ],
};

const getActiveIcon = (icon: React.ReactElement) => cloneElement(icon, { fill: Colors.PRIMARY });

const MyTabBar = ({ state, descriptors, navigation }: any) => {
  const { t } = useTranslation();
  const { buildHref } = useLinkBuilder();
  const { bottom } = useSafeAreaInsets();
  const { infoUser } = useInfoUser();

  // Logic xác định cấu hình icon dựa trên nhóm người dùng
  const getTabIcons = () => {
    const userGroups = infoUser?.groups?.map(group => group.id) || [];
    if (userGroups.some(id => GROUP_IDS.GROUP_A.includes(id))) {
      return tabIconConfigs.groupA;
    }
    if (userGroups.some(id => GROUP_IDS.GROUP_B.includes(id))) {
      return tabIconConfigs.groupB;
    }
    return tabIconConfigs.default;
  };

  const tabs = getTabIcons();

  return (
    <View style={[styles.row]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tabConfig = tabs[index];

        if (!tabConfig) {
          return null; // Tránh lỗi nếu cấu hình không khớp
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
            {isFocused ? getActiveIcon(tabConfig.icon) : tabConfig.icon}
            <AppText
              numberOfLines={1}
              size={12}
              mt={4}
              style={{
                color: isFocused ? Colors.PRIMARY : Colors.TEXT_DEFAULT,
              }}>
              {t(tabConfig.labelKey)}
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
