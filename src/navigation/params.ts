import { Dispatch, SetStateAction } from 'react';
import { ResponseImageElement } from '../interface/Verify.interface';
import { typeHotel } from '../screens/authScreen/LoginScreen';
import {
  AssignPriceFilters,
  DataAssignPrice,
  SelectedOption,
} from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { ResponseNcc } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { TypePickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
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
  HomeScreen: undefined;
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
  FilterAssignPriceScreen: {
    currentFilters: AssignPriceFilters;
    onApplyFilters: (filters: AssignPriceFilters) => void;
  };
  FilterApproveScreen: {
    currentFilters: AssignPriceFilters;
    onApplyFilters: (filters: AssignPriceFilters) => void;
  };
  FilterCreatePriceScreen: {
    currentFilters: AssignPriceFilters;
    onApplyFilters: (filters: AssignPriceFilters) => void;
  };
  DetailAssignPriceCardScreen: { item: DataAssignPrice };
  DetailApproveCardScreen: { item: TypeApprove };
  InformationItemsScreen: { item: DataAssignPrice };
  MyTabs: undefined;
  MyTabsHk: undefined;
  NotificationScreen: undefined;
  NotificationHkScreen: undefined;
  DetailOrderApproveScreen: { item: DataAssignPrice };

  // Modals
  ModalPhotoOrCamera: {
    setImageAvatar: (v: ResponseImageElement) => void;
  };
  NoteScreen: undefined;
  DetailRoomScreen: { id: string };
  InformationRoomScreen: { id: string };
  ChangePasswordScreen: {
    type: 'reset' | 'change';
  };
  ModalPickCalendar:
    | {
        isSingleMode: boolean;
        onSelectDate?: Dispatch<SetStateAction<Date | undefined>>;
        onSelectRange?: (start: any, end: any) => void;
        initialStartDate?: Date | null;
        initialEndDate?: Date | null;
        initialDate?: Date | null;
        minDate?: Date | null;
        maxDate?: Date | null;
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
    setRequester: Dispatch<SetStateAction<SelectedOption>>;
    requester: SelectedOption;
  };
  PickLocalScreen: {
    setLocation: Dispatch<SetStateAction<SelectedOption>>;
    location: SelectedOption;
  };
  ModalInputRejectAssign: {
    id: string;
  };
  ModalInputRejectApprove: {
    id: string;
  };
};

// ─────────────────────────────────────────────────────────────
// Auth Stack Navigation (trước khi login)
// ─────────────────────────────────────────────────────────────

export type AuthParams = {
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
  ChangePasswordScreen: {
    type: 'reset' | 'change';
  };
  ModalPickHotel: {
    setHotel: (hotel: typeHotel) => void;
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
