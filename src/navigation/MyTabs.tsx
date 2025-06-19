import { StyleSheet } from 'react-native';
import React from 'react';
import { s } from 'react-native-size-matters';
import HomeScreen from '../views/homeScreen/HomeScreen';
import NotificationScreen from '../screens/notificationScreen/view/NotificationScreen';
import { MainParams, TabBarParams } from './params';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import light from '../theme/light';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountScreen from '../screens/accountScreen/AccountScreen';
import MyTabBar from './MyTabBar';
import AssignPriceScreen from '../screens/assignPriceScreen/view/AssignPriceScreen';
import CreatePriceScreen from '@/screens/createPriceScreen/view/CreatePriceScreen';
import CreatePoScreen from '@/screens/createPoScreen/view/CreatePoScreen';
import PcLogScreen from '@/screens/pcLogScreen/view/PcLogScreen';
import PcPrScreen from '@/screens/pcPrScreen/view/PcPrScreen';

const MyTabs = ({ navigation }: NativeStackScreenProps<MainParams, 'MyTabs'>) => {
  const Tab = createBottomTabNavigator<TabBarParams>();
  const tabBar = (props: any) => <MyTabBar {...props} />;
  const { top } = useSafeAreaInsets();
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
      <Tab.Screen name="CreatePoScreen" component={CreatePoScreen} />
      <Tab.Screen name="PcLogScreen" component={PcLogScreen} />
      <Tab.Screen name="PcPrScreen" component={PcPrScreen} />
    </Tab.Navigator>
  );
};
export default MyTabs;

const styles = StyleSheet.create({});
