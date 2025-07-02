import { Dispatch, SetStateAction } from 'react';
import { ResponseImageElement } from '../interface/Verify.interface';
import { typeHotel } from '../screens/authScreen/LoginScreen';
import { DataAssignPrice } from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { ResponseNcc } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { TypePickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { TypePickRequester } from '@/views/modal/modalPickRequester/modal/PickRequesterModal';
import { TypeApprove } from '@/screens/approvePrScreen/modal/ApproveModal';

// ─────────────────────────────────────────────────────────────
// Bottom Tab Navigation
// ─────────────────────────────────────────────────────────────

export type TabBarParams = {
  AssignPriceScreen: undefined;
  CreatePriceScreen: undefined;
  CreatePoScreen: undefined;
  PcLogScreen: undefined;
  PcPrScreen: undefined;
};

// ─────────────────────────────────────────────────────────────
// Main Stack Navigation (sau khi login)
// ─────────────────────────────────────────────────────────────

export type MainParams = {
  ImageViewScreen: {
    images: { uri: string }[];
    imageIndex: number;
    onRequestClose?: () => void;
  };
  ProfileScreen: undefined;
  ApprovePrScreen: undefined;
  CreatePriceNccScreen: undefined;
  AccountScreen: undefined;
  FilterScreen: undefined;
  DetailAssignPriceCardScreen: { item: DataAssignPrice };
  DetailApproveCardScreen: { item: TypeApprove };
  InformationItemsScreen: { item: DataAssignPrice };
  MyTabs: undefined;
  NotificationScreen: undefined;
  DetailOrderApproveScreen: { item: DataAssignPrice };

  // Modals
  ModalPhotoOrCamera: {
    setImageAvatar: (v: ResponseImageElement) => void;
  };
  ChangePasswordScreen: undefined;
  ModalPickCalendar:
    | {
        isSingleMode: boolean;
        onSelectDate?: Dispatch<SetStateAction<Date | undefined>>;
        onSelectRange?: (start: any, end: any) => void;
      }
    | undefined;
  OtpMainNavigationScreen: {
    type: 'verifyEmail';
  };
  PickNccScreen: {
    setNcc: Dispatch<SetStateAction<ResponseNcc>>;
    ncc: ResponseNcc;
  };
  PickDepartmentScreen: {
    setDepartment: Dispatch<SetStateAction<TypePickDepartment>>;
    department: TypePickDepartment;
  };

  PickItemScreen: {
    setItem: (item: { id: string; name: string }) => void;
  };

  PickRequesterScreen: {
    setRequester: Dispatch<SetStateAction<TypePickRequester>>;
    requester: TypePickRequester;
  };
};

// ─────────────────────────────────────────────────────────────
// Auth Stack Navigation (trước khi login)
// ─────────────────────────────────────────────────────────────

export type AuthParams = {
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
  ModalPickHotel: {
    setHotel: Dispatch<SetStateAction<typeHotel>>;
    hotel: typeHotel;
  };
};

// ─────────────────────────────────────────────────────────────
// Gộp chung Stack Navigation
// ─────────────────────────────────────────────────────────────

export type RootStackParams = MainParams & AuthParams;

// ─────────────────────────────────────────────────────────────
// Typed Navigation Props dùng trong screen components
// ─────────────────────────────────────────────────────────────
