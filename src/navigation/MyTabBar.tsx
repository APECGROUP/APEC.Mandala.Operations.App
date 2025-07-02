import { StyleSheet, View } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import light from '../theme/light';
import { cloneElement } from 'react';
import { AppText } from '../elements/text/AppText';
import { useTranslation } from 'react-i18next';
import { vs } from 'react-native-size-matters';
import IconTab1 from '@assets/icon/IconTab1';
import IconTab2 from '@assets/icon/IconTab2';
import { Colors } from '@/theme/Config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const MyTabBar = ({ state, descriptors, navigation }: any) => {
  const { t } = useTranslation();
  const { buildHref } = useLinkBuilder();
  const { bottom } = useSafeAreaInsets();
  const tabIcons: any = [
    {
      icon: <IconTab1 />,
      iconActive: <IconTab1 fill={light.primary} />,
      label: t('myTabs.tab1'),
    },
    {
      icon: <IconTab2 />,
      iconActive: <IconTab2 fill={light.primary} />,
      label: t('myTabs.tab2'),
    },
    {
      icon: <IconTab2 />,
      iconActive: <IconTab2 fill={light.primary} />,
      label: t('myTabs.tab3'),
    },
    {
      icon: <IconTab2 />,
      iconActive: <IconTab2 fill={light.primary} />,
      label: t('myTabs.tab4'),
    },
    // {
    //   icon: <IconTab2 />,
    //   iconActive: <IconTab2 fill={light.primary} />,
    //   label: t('myTabs.tab5'),
    // },
  ];
  return (
    <View style={[styles.row]}>
      {state.routes.map((route: any, index: string) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

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

        const onLongPress = () => {
          // navigation.emit({
          //   type: 'tabLongPress',
          //   target: route.key,
          // });
          // Alert.alert('long press');
        };

        return (
          <PlatformPressable
            key={index}
            pressOpacity={1}
            android_ripple={{ color: 'transparent' }}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.button, { paddingBottom: bottom }]}>
            {isFocused
              ? cloneElement(tabIcons[index].iconActive)
              : cloneElement(tabIcons[index].icon)}

            <AppText
              numberOfLines={1}
              size={12}
              mt={4}
              style={{
                color: isFocused ? Colors.PRIMARY : Colors.TEXT_DEFAULT,
              }}>
              {tabIcons[index].label}
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
