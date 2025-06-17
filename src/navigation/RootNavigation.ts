import {NavigationContainerRef} from '@react-navigation/native';
import React from 'react';
import {RootStackParams} from './params';

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParams>>();

export function navigate<RouteName extends keyof RootStackParams>(
  ...args: undefined extends RootStackParams[RouteName]
    ? [name: RouteName, params?: RootStackParams[RouteName]]
    : [name: RouteName, params: RootStackParams[RouteName]]
) {
  navigationRef.current?.navigate(...args);
}

export function goBack() {
  navigationRef.current?.goBack();
}
