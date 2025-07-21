import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import React from 'react';
import { RootStackParams } from './params';

// Định nghĩa lại kiểu cho navigationRef để bao gồm các hành động của Stack Navigator
// Điều này giúp TypeScript nhận diện được phương thức 'push'
export const navigationRef = React.createRef<
  NavigationContainerRef<RootStackParams> & {
    dispatch: (action: any) => void; // Thêm dispatch để có thể gửi các action như push
  }
>();

export function navigate<RouteName extends keyof RootStackParams>(
  name: RouteName,
  params?: RootStackParams[RouteName],
) {
  // TypeScript vẫn an toàn ở đây nhờ RootStackParams
  navigationRef.current?.navigate(name as any, params as any);
}

export function push<RouteName extends keyof RootStackParams>(
  name: RouteName,
  params?: RootStackParams[RouteName],
) {
  // Sử dụng StackActions.push để thực hiện hành động push
  // Đảm bảo rằng navigationRef.current và dispatch tồn tại
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.push(name, params));
  }
}

export function goBack() {
  navigationRef.current?.goBack();
}
