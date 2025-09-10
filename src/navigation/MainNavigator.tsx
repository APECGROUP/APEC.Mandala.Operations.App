import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainParams } from './params';
import { s } from 'react-native-size-matters';
import NotificationScreen from '../screens/notificationScreen/view/NotificationScreen';

import Utilities, { isAndroid } from '../utils/Utilities';
import { useAlert } from '../elements/alert/AlertProvider';
import ModalPhotoOrCamera from '../views/modal/ModalPhotoOrCamera';
import ProfileScreen from '../screens/profileScreen/ProfileScreen';
import light from '../theme/light';
import { useTranslation } from 'react-i18next';
import { getFontSize } from '../constants';
import MyTabs from './MyTabs';
import { HeaderLeft } from './AuthNavigator';
import { PaddingHorizontal } from '@/utils/Constans';
import ModalPickCalendar from '@/elements/calendar/ModalPickCalendar';
import AccountScreen from '@/screens/accountScreen/AccountScreen';
import { Colors } from '@/theme/Config';
import ChangePasswordScreen from '@/screens/changePasswordScreen/ChangePasswordScreen';
import DetailAssignPriceCardScreen from '@/screens/assignPriceScreen/view/component/DetailAssignPriceCardScreen';
import PickNccScreen from '@/views/modal/modalPickNcc/view/PickNccScreen';
import FilterAssignPriceScreen from '@/screens/filterScreen/view/FilterAssignPriceScreen';
import PickDepartmentScreen from '@/views/modal/modalPickDepartment/view/PickDepartmentScreen';
import PickRequesterScreen from '@/views/modal/modalPickRequester/view/PickRequesterScreen';
import CreatePriceNccScreen from '@/screens/createPriceScreen/view/component/CreatePriceNccScreen';
import ApprovePrScreen from '@/screens/approvePrScreen/view/ApprovePrScreen';
import DetailApproveCardScreen from '@/screens/approvePrScreen/view/component/DetailApproveCardScreen';
import DetailOrderApproveScreen from '@/screens/detailOrderApproveScreen/view/DetailOrderApproveScreen';
import PickItemScreen from '@/views/modal/modalPickItem/view/PickItemScreen';
import FilterApproveScreen from '@/screens/filterScreen/view/FilterApproveScreen';
import FilterCreatePriceScreen from '@/screens/filterScreen/view/FilterCreatePriceScreen';
import PickLocalScreen from '@/views/modal/modalPickLocal/view/PickLocalScreen';
import MyTabsHk from '@/screens/routerHk/MyTabsHk';
import InformationRoomScreen from '@/screens/routerHk/DetailRooomScreen/view/InformationRoomScreen';
import DetailRoomScreen from '@/screens/routerHk/DetailRooomScreen/view/component/DetailRoomScreen';
import ModalInputRejectAssign from '@/views/modal/modalInputRejectAssign/ModalInputRejectAssign';
import ModalInputRejectApprove from '@/views/modal/modalInputRejectApprove/ModalInputRejectApprove';
import NotificationHkScreen from '@/screens/routerHk/notificationHkScreen/view/NotificationHkScreen';
import NoteScreen from '@/screens/routerHk/homeScreen/view/component/NoteScreen';
import FilterPcPrScreen from '@/screens/filterScreen/view/FilterPcPrScreen';
import DetailPcPrCardScreen from '@/screens/pcPrScreen/view/component/DetailPcPrCardScreen';
import InformationItemsPcPrScreen from '@/screens/InformationItemPcPrScreen/view/InformationItemsPcPrScreen';
import PickStatusScreen from '@/views/modal/modalPickStatus/view/PickStatusScreen';
import FilterCreatePoScreen from '@/screens/filterScreen/view/FilterCreatePoScreen';
import EditPriceNCCScreen from '@/screens/createPriceScreen/view/component/EditPriceNCCScreen';
import InformationItemsAssignPrice from '@/screens/InformationItemScreen/view/InformationItemsAssignPrice';
import PickPriceFromNccScreen from '@/views/modal/modalPickPriceFromNcc/view/PickPriceFromNccScreen';
export default function MainNavigator() {
  const { Navigator, Group, Screen } = createNativeStackNavigator<MainParams>();
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  // console.log('mainNavigation: ', infoUser, infoUser.profile?.fullName);
  const getPermission = async () => {
    await Utilities.requestNotificationPermission(showAlert);
  };

  useEffect(() => {
    // fetData();
    getPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Navigator
      initialRouteName={'MyTabsHk'}
      // initialRouteName={'MyTabs'}
      // initialRouteName={'ApprovePrScreen'}
      // initialRouteName={!infoUser?.isApprove ? 'MyTabs' : 'ApprovePrScreen'}
      screenOptions={{
        // animation: 'simple_push',
        headerShown: false,
        headerTransparent: false,
        // headerStyle: { backgroundColor: 'red' },
        headerBackButtonDisplayMode: 'minimal',
        headerLeft: HeaderLeft,

        headerTitleStyle: {
          fontSize: isAndroid() ? 18 : getFontSize(18),
          color: light.text,
          fontWeight: '700',
        },
        headerStyle: {},

        headerShadowVisible: false,

        contentStyle: {
          backgroundColor: '#fff',
          paddingHorizontal: PaddingHorizontal,
          // paddingTop: 10,
        },
        headerTitleAlign: 'center',
      }}>
      <Group>
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('orderInfo.title'),
          }}
          name="DetailAssignPriceCardScreen"
          component={DetailAssignPriceCardScreen}
        />
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('orderInfo.title'),
          }}
          name="DetailPcPrCardScreen"
          component={DetailPcPrCardScreen}
        />
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('orderInfo.title'),
          }}
          name="DetailApproveCardScreen"
          component={DetailApproveCardScreen}
        />
        <Screen
          options={{
            contentStyle: {
              paddingHorizontal: 0,
            },
          }}
          name="CreatePriceNccScreen"
          component={CreatePriceNccScreen}
        />
        <Screen
          options={{
            headerShown: false,
            headerTitle: t('createPrice.editPriceNCC'),
            contentStyle: {
              paddingHorizontal: 0,
            },
          }}
          name="EditPriceNCCScreen"
          component={EditPriceNCCScreen}
        />
        <Screen
          name="InformationItemsAssignPrice"
          component={InformationItemsAssignPrice}
          options={{
            // animation: 'fade',
            // animation: 'fade_from_bottom' ,
            // animation: 'flip',
            // animation: 'ios_from_left',
            // animation: 'ios_from_right',
            // animation: 'none',
            // animation: 'simple_push',
            // animation: 'slide_from_bottom',
            // animation:'slide_from_left' ,
            // animation:'slide_from_right' ,
            headerShown: false,
            contentStyle: {
              paddingHorizontal: 0,
            },
          }}
        />
        <Screen
          name="InformationItemsPcPrScreen"
          component={InformationItemsPcPrScreen}
          options={{
            headerShown: false,
            contentStyle: {
              paddingHorizontal: 0,
            },
          }}
        />
        <Screen
          name="DetailOrderApproveScreen"
          component={DetailOrderApproveScreen}
          options={{
            headerShown: false,
            contentStyle: {
              paddingHorizontal: 0,
            },
          }}
        />
        <Screen
          name="ApprovePrScreen"
          component={ApprovePrScreen}
          options={{
            headerShown: false,
            contentStyle: {
              paddingHorizontal: 0,
            },
          }}
        />

        <Screen
          options={{
            headerShown: false,
            contentStyle: { paddingHorizontal: s(0) },
          }}
          name="MyTabs"
          component={MyTabs}
        />
        <Screen
          options={{
            headerShown: false,
            contentStyle: { paddingHorizontal: s(0) },
          }}
          name="MyTabsHk"
          component={MyTabsHk}
        />
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('filter.title'),
            contentStyle: {
              paddingHorizontal: 0,
              backgroundColor: Colors.WHITE,
            },
          }}
          name="FilterAssignPriceScreen"
          component={FilterAssignPriceScreen}
        />
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('filter.title'),
            contentStyle: {
              paddingHorizontal: 0,
              backgroundColor: Colors.WHITE,
            },
          }}
          name="FilterCreatePoScreen"
          component={FilterCreatePoScreen}
        />
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('filter.title'),
            contentStyle: {
              paddingHorizontal: 0,
              backgroundColor: Colors.WHITE,
            },
          }}
          name="FilterPcPrScreen"
          component={FilterPcPrScreen}
        />
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('filter.title'),
            contentStyle: {
              paddingHorizontal: 0,
              backgroundColor: Colors.WHITE,
            },
          }}
          name="FilterApproveScreen"
          component={FilterApproveScreen}
        />
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('filter.title'),
            contentStyle: {
              paddingHorizontal: 0,
              backgroundColor: Colors.WHITE,
            },
          }}
          name="FilterCreatePriceScreen"
          component={FilterCreatePriceScreen}
        />

        <Screen
          options={{
            headerShown: true,
            headerTitle: '',
            contentStyle: {
              paddingHorizontal: 0,
              backgroundColor: Colors.WHITE,
            },
          }}
          name={'ChangePasswordScreen'}
          component={ChangePasswordScreen}
        />

        <Screen
          options={{ headerShown: true, headerTitle: t('account.profile.title') }}
          name="ProfileScreen"
          component={ProfileScreen}
        />
        <Screen
          options={{
            headerShown: true,
            headerTitle: t('account.title'),
          }}
          name="AccountScreen"
          component={AccountScreen}
        />

        <Screen
          options={{
            headerShown: false,
            contentStyle: {
              paddingHorizontal: s(0),
              backgroundColor: light.white,
            },
          }}
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Screen
          options={{
            headerShown: false,
            contentStyle: {
              paddingHorizontal: s(0),
              backgroundColor: light.white,
            },
          }}
          name="NotificationHkScreen"
          component={NotificationHkScreen}
        />
      </Group>

      {/* modal */}
      <Group
        screenOptions={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: { backgroundColor: '#0000001A' },
        }}>
        <Screen name={'ModalPhotoOrCamera'} component={ModalPhotoOrCamera} />
        <Screen name={'ModalPickCalendar'} component={ModalPickCalendar} />
        <Screen name={'PickNccScreen'} component={PickNccScreen} />
        <Screen name={'PickPriceFromNccScreen'} component={PickPriceFromNccScreen} />
        <Screen name={'PickDepartmentScreen'} component={PickDepartmentScreen} />
        <Screen name={'PickItemScreen'} component={PickItemScreen} />
        <Screen name={'InformationRoomScreen'} component={InformationRoomScreen} />
        <Screen name={'PickLocalScreen'} component={PickLocalScreen} />
        <Screen name={'PickRequesterScreen'} component={PickRequesterScreen} />
        <Screen name={'DetailRoomScreen'} component={DetailRoomScreen} />
        <Screen name={'PickStatusScreen'} component={PickStatusScreen} />
        <Screen name={'ModalInputRejectAssign'} component={ModalInputRejectAssign} />
        <Screen name={'ModalInputRejectApprove'} component={ModalInputRejectApprove} />
        <Screen name={'NoteScreen'} component={NoteScreen} />
      </Group>
    </Navigator>
  );
}
