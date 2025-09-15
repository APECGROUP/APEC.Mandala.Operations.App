import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './homeScreen/view/HomeScreen';
import MyTabBar from '@/navigation/MyTabBar';
import { TabBarParams } from '@/navigation/params';
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
          paddingHorizontal: 0,
        },
      }}
      tabBar={tabBar}
      // initialRouteName="HomeScreen"
    >
      {/* <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          sceneStyle: {
            paddingHorizontal: 0,
          },
        }}
      /> */}
      <Tab.Screen name="CreatePriceScreen" component={HomeScreen} />
      <Tab.Screen name="CreatePoScreen" component={HomeScreen} />
      <Tab.Screen name="PcPrScreen" component={HomeScreen} />
    </Tab.Navigator>
  );
};
export default MyTabsHk;
