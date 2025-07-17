import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreatePriceScreen from '@/screens/createPriceScreen/view/CreatePriceScreen';
import PcPrScreen from '@/screens/pcPrScreen/view/PcPrScreen';
import CreatePoScreen from '@/screens/createPoScreen/view/CreatePoScreen';
import HomeScreen from './homeScreen/view/HomeScreen';
import MyTabBar from '@/navigation/MyTabBar';
import { TabBarParams } from '@/navigation/params';
import { PaddingHorizontal } from '@/utils/Constans';
import { Colors } from '@/theme/Config';

const MyTabsHk = () => {
  const Tab = createBottomTabNavigator<TabBarParams>();
  const tabBar = (props: any) => <MyTabBar {...props} />;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: Colors.WHITE,

          // paddingTop: top,
          paddingHorizontal: PaddingHorizontal,
        },
      }}
      tabBar={tabBar}
      initialRouteName="HomeScreen">
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          sceneStyle: {
            paddingHorizontal: 0,
          },
        }}
      />
      <Tab.Screen name="CreatePriceScreen" component={CreatePriceScreen} />
      <Tab.Screen name="CreatePoScreen" component={CreatePoScreen} />
      <Tab.Screen name="PcPrScreen" component={PcPrScreen} />
    </Tab.Navigator>
  );
};
export default MyTabsHk;
