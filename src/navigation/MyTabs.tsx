import React from 'react';
import { TabBarParams } from './params';
import light from '../theme/light';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar from './MyTabBar';
import AssignPriceScreen from '../screens/assignPriceScreen/view/AssignPriceScreen';
import CreatePriceScreen from '@/screens/createPriceScreen/view/CreatePriceScreen';
import PcPrScreen from '@/screens/pcPrScreen/view/PcPrScreen';
import CreatePoScreen from '@/screens/createPoScreen/view/CreatePoScreen';

const MyTabs = () => {
  const Tab = createBottomTabNavigator<TabBarParams>();
  const tabBar = (props: any) => <MyTabBar {...props} />;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: light.backgroundScreenDefault,

          // paddingTop: top,
          // paddingHorizontal: s(16),
        },
      }}
      tabBar={tabBar}
      initialRouteName="AssignPriceScreen">
      <Tab.Screen
        name="AssignPriceScreen"
        component={AssignPriceScreen}
        // options={
        //   {
        //     sceneStyle: {paddingHorizontal: 0, backgroundColor: light.white},
        //   }
        // }
      />
      <Tab.Screen name="CreatePriceScreen" component={CreatePriceScreen} />
      {/* <Tab.Screen name="CreatePoScreen" component={ApprovePrScreen} /> */}
      <Tab.Screen name="CreatePoScreen" component={CreatePoScreen} />
      <Tab.Screen name="PcPrScreen" component={PcPrScreen} />
      {/* <Tab.Screen name="PcLogScreen" component={PcLogScreen} /> */}
    </Tab.Navigator>
  );
};
export default MyTabs;
