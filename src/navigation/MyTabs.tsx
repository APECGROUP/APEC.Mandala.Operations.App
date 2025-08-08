import React, { lazy } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarParams } from './params';
import light from '../theme/light';
import MyTabBar from './MyTabBar';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import { IUser } from '@/screens/authScreen/modal/AuthModal';

// Định nghĩa các hằng số cho ID nhóm người dùng
const GROUP_IDS = {
  GROUP_A: [14], // Trưởng bộ phận mua hàng, Admin
  GROUP_B: [10, 12, 13], // Trưởng bộ phận, Kế toán trưởng, OM, GM
};

// --- Mới: Tách các hằng số và logic xác định nhóm ra một file riêng (nếu cần) ---
// Ví dụ: utils/userGroups.ts
export const getTabConfigKey = (infoUser: IUser): 'groupA' | 'groupB' | 'default' => {
  const userGroups = infoUser?.groups?.map(group => group.id) || [];
  if (userGroups.some(id => GROUP_IDS.GROUP_A.includes(id))) {
    return 'groupA';
  }
  if (userGroups.some(id => GROUP_IDS.GROUP_B.includes(id))) {
    return 'groupB';
  }
  return 'default';
};

// --- Quay lại MyTabs.tsx ---
const screens = {
  AssignPriceScreen: lazy(() => import('../screens/assignPriceScreen/view/AssignPriceScreen')),
  CreatePriceScreen: lazy(() => import('@/screens/createPriceScreen/view/CreatePriceScreen')),
  PcPrScreen: lazy(() => import('@/screens/pcPrScreen/view/PcPrScreen')),
  CreatePoScreen: lazy(() => import('@/screens/createPoScreen/view/CreatePoScreen')),
  ApprovePrScreen: lazy(() => import('@/screens/approvePrScreen/view/ApprovePrScreen')),
};

const tabConfigs = {
  groupA: [
    { name: 'AssignPriceScreen', component: screens.AssignPriceScreen },
    { name: 'CreatePriceScreen', component: screens.CreatePriceScreen },
    { name: 'ApprovePrScreen', component: screens.ApprovePrScreen },
    { name: 'CreatePoScreen', component: screens.CreatePoScreen },
    { name: 'PcPrScreen', component: screens.PcPrScreen },
  ],
  groupB: [
    { name: 'ApprovePrScreen', component: screens.ApprovePrScreen },
    { name: 'PcPrScreen', component: screens.PcPrScreen },
  ],
  default: [
    { name: 'AssignPriceScreen', component: screens.AssignPriceScreen },
    { name: 'CreatePriceScreen', component: screens.CreatePriceScreen },
    { name: 'CreatePoScreen', component: screens.CreatePoScreen },
    { name: 'PcPrScreen', component: screens.PcPrScreen },
  ],
};

const MyTabs = () => {
  const Tab = createBottomTabNavigator<TabBarParams>();
  const { infoUser } = useInfoUser();

  const tabConfigKey = getTabConfigKey(infoUser!); // Sử dụng hàm từ file riêng
  const tabs = tabConfigs[tabConfigKey];

  // Xử lý trường hợp không có tabs nào được định nghĩa
  if (!tabs || tabs.length === 0) {
    // Có thể render một màn hình trống hoặc thông báo lỗi
    return null;
  }

  // Đảm bảo initialRouteName luôn là một route hợp lệ
  const initialRouteName = tabs[0].name as keyof TabBarParams;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: light.backgroundScreenDefault,
        },
      }}
      tabBar={props => <MyTabBar {...props} tabConfigKey={tabConfigKey} />}
      initialRouteName={initialRouteName}>
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name as keyof TabBarParams}
          component={tab.component}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MyTabs;
