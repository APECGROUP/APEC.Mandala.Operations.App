import React from 'react';
import { TabBarParams } from './params';
import light from '../theme/light';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar from './MyTabBar';

const MyTabs = () => {
  const Tab = createBottomTabNavigator<TabBarParams>();
  const tabBar = (props: any) => <MyTabBar {...props} />;
  const AssignPriceScreen = React.lazy(
    () => import('../screens/assignPriceScreen/view/AssignPriceScreen'),
  );
  const CreatePriceScreen = React.lazy(
    () => import('@/screens/createPriceScreen/view/CreatePriceScreen'),
  );
  const PcPrScreen = React.lazy(() => import('@/screens/pcPrScreen/view/PcPrScreen'));
  const CreatePoScreen = React.lazy(() => import('@/screens/createPoScreen/view/CreatePoScreen'));
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
