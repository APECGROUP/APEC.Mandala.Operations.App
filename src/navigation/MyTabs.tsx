import React, { lazy, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarParams } from './params';
import light from '../theme/light';
import MyTabBar from './MyTabBar';
import { useInfoUser } from '@/zustand/store/useInfoUser/useInfoUser';
import { IUser } from '@/screens/authScreen/modal/AuthModal';

// --- Định nghĩa các hằng số cho ID nhóm người dùng và mã bộ phận đặc biệt ---
const GROUP_ROLES = {
  PC_PR_VIEWER: 9, // Chỉ xem PC PR
  PO_CREATOR_ASSIGNER: 11, // Tạo giá NCC, Gán giá, Tạo PO, PC PR
  PR_APPROVER: [10, 12, 13], // Duyệt PR (10: Trưởng bộ phận, 12: Kế toán trưởng, 13: OM/GM)
  ADMIN: 14, // Toàn quyền
};

const DEPARTMENT_CODES = {
  PURCHASING: '13003', // Mã bộ phận mua hàng đặc biệt
};

// --- Định nghĩa ánh xạ màn hình với các hằng số ---
const SCREENS = {
  AssignPriceScreen: {
    name: 'AssignPriceScreen',
    component: lazy(() => import('../screens/assignPriceScreen/view/AssignPriceScreen')),
  },
  CreatePriceScreen: {
    name: 'CreatePriceScreen',
    component: lazy(() => import('@/screens/createPriceScreen/view/CreatePriceScreen')),
  },
  ApprovePrScreen: {
    name: 'ApprovePrScreen',
    component: lazy(() => import('@/screens/approvePrScreen/view/ApprovePrScreen')),
  },
  CreatePoScreen: {
    name: 'CreatePoScreen',
    component: lazy(() => import('@/screens/createPoScreen/view/CreatePoScreen')),
  },
  PcPrScreen: {
    name: 'PcPrScreen',
    component: lazy(() => import('@/screens/pcPrScreen/view/PcPrScreen')),
  },
};

// --- Hàm xác định quyền truy cập màn hình của người dùng ---
const getUserAccessibleScreens = (infoUser: IUser): (keyof typeof SCREENS)[] => {
  const accessibleScreens = new Set<keyof typeof SCREENS>();
  const userGroupIds = infoUser?.groups?.map(group => group.id) || [];
  const userDepartmentCodes = infoUser?.departments?.map(dept => dept.departmentCode) || [];

  // 1. Kiểm tra quyền Admin (ID 14) - Ưu tiên cao nhất
  if (userGroupIds.includes(GROUP_ROLES.ADMIN)) {
    return Object.keys(SCREENS) as (keyof typeof SCREENS)[];
  }

  // 2. Kiểm tra điều kiện đặc biệt cho Trưởng bộ phận (ID 10) thuộc bộ phận mua hàng (13003)
  if (
    userGroupIds.includes(GROUP_ROLES.PR_APPROVER[0]) &&
    userDepartmentCodes.includes(DEPARTMENT_CODES.PURCHASING)
  ) {
    return Object.keys(SCREENS) as (keyof typeof SCREENS)[];
  }

  // 3. Phân quyền theo các nhóm còn lại
  userGroupIds.forEach(groupId => {
    switch (groupId) {
      case GROUP_ROLES.PC_PR_VIEWER: // ID 9
        accessibleScreens.add('PcPrScreen');
        break;
      case GROUP_ROLES.PO_CREATOR_ASSIGNER: // ID 11
        accessibleScreens.add('CreatePriceScreen');
        accessibleScreens.add('AssignPriceScreen');
        accessibleScreens.add('CreatePoScreen');
        accessibleScreens.add('PcPrScreen');
        break;
      // Các ID duyệt PR: 10, 12, 13
      case GROUP_ROLES.PR_APPROVER[0]: // ID 10
      case GROUP_ROLES.PR_APPROVER[1]: // ID 12
      case GROUP_ROLES.PR_APPROVER[2]: // ID 13
        accessibleScreens.add('ApprovePrScreen');
        break;
      default:
        // Không thêm màn hình nào nếu không thuộc các nhóm trên
        break;
    }
  });

  return Array.from(accessibleScreens);
};

const MyTabs = () => {
  const Tab = createBottomTabNavigator<TabBarParams>();
  const { infoUser } = useInfoUser();

  // Sử dụng useMemo để tính toán các tab có thể truy cập
  const accessibleScreenNames = useMemo(() => {
    if (!infoUser) {
      return [];
    }
    return getUserAccessibleScreens(infoUser);
  }, [infoUser]);

  // Lọc ra các tab cần hiển thị dựa trên quyền của người dùng
  const availableTabs = useMemo(
    () =>
      (Object.values(SCREENS) as (typeof SCREENS)[keyof typeof SCREENS][]).filter(screen =>
        accessibleScreenNames.includes(screen.name as keyof typeof SCREENS),
      ),
    [accessibleScreenNames],
  );

  // Xử lý trường hợp không có tabs nào được định nghĩa hoặc người dùng không có quyền truy cập
  if (!availableTabs || availableTabs.length === 0) {
    // Có thể render một màn hình trống, màn hình lỗi hoặc màn hình không có quyền truy cập
    console.warn('Người dùng không có quyền truy cập màn hình nào.');
    return null; // Hoặc một fallback UI phù hợp
  }

  // Đảm bảo initialRouteName luôn là một route hợp lệ
  const initialRouteName = availableTabs[0].name as keyof TabBarParams;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: light.backgroundScreenDefault,
        },
      }}
      tabBar={props => <MyTabBar {...props} />} // MyTabBar không cần tabConfigKey nữa
      initialRouteName={initialRouteName}>
      {availableTabs.map(tab => (
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
