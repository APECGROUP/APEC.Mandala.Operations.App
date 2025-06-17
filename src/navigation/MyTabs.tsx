import {StyleSheet} from 'react-native';
import React from 'react';
import {s} from 'react-native-size-matters';
import HomeScreen from '../views/homeScreen/HomeScreen';
import NotificationScreen from '../screens/notificationScreen/view/NotificationScreen';
import {MainParams, TabBarParams} from './params';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import light from '../theme/light';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AccountScreen from '../screens/accountScreen/AccountScreen';
import MyTabBar from './MyTabBar';
import AssignPriceScreen from '../screens/assignPriceScreen/view/AssignPriceScreen';

const MyTabs = ({navigation}: NativeStackScreenProps<MainParams, 'MyTabs'>) => {
  const Tab = createBottomTabNavigator<TabBarParams>();
  const tabBar = (props: any) => <MyTabBar {...props} />;
  const {top} = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        animation: 'fade',
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
      <Tab.Screen name="tab2" component={AssignPriceScreen} />
      <Tab.Screen name="tab3" component={AssignPriceScreen} />
      <Tab.Screen name="tab4" component={AssignPriceScreen} />
      <Tab.Screen name="tab5" component={AssignPriceScreen} />
    </Tab.Navigator>
  );
};
export default MyTabs;

const styles = StyleSheet.create({});
