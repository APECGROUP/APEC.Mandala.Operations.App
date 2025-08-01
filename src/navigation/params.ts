import { Dispatch, SetStateAction } from 'react';
import { ResponseImageElement } from '../interface/Verify.interface';
import {
  AssignPriceFilters,
  DataAssignPrice,
  SelectedOption,
} from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { IItemSupplier, ResponseNcc } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { TypeApprove } from '@/screens/approvePrScreen/modal/ApproveModal';
import { IDataListHotel } from '@/views/modal/modalPickHotel/modal/PickHotelModal';
import { DataPcPr, PcPrFilters } from '@/screens/pcPrScreen/modal/PcPrModal';
import { IPickStatus } from '@/views/modal/modalPickStatus/modal/PickStatusModal';
import { IPickLocal } from '@/views/modal/modalPickLocal/modal/PickLocalModal';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';
import { IStausGlobal } from '@/zustand/store/useStatusGlobal/useStatusGlobal';

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
  FilterAssignPriceScreen: {
    currentFilters: AssignPriceFilters;
    onApplyFilters: (filters: AssignPriceFilters) => void;
  };
  FilterCreatePoScreen: {
    currentFilters: AssignPriceFilters;
    onApplyFilters: (filters: AssignPriceFilters) => void;
  };
  FilterPcPrScreen: {
    currentFilters: PcPrFilters;
    onApplyFilters: (filters: PcPrFilters) => void;
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
  DetailPcPrCardScreen: { item: DataPcPr };
  DetailApproveCardScreen: { item: TypeApprove };
  InformationItemsScreen: { item: DataAssignPrice };
  InformationItemsPcPrScreen: { item: DataAssignPrice };
  MyTabs: undefined;
  NotificationScreen: undefined;
  DetailOrderApproveScreen: { item: DataAssignPrice };

  // Modals
  ModalPhotoOrCamera: {
    setImageAvatar: (v: ResponseImageElement) => void;
  };
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
    setNcc: Dispatch<SetStateAction<IItemSupplier>>;
    ncc: IItemSupplier;
  };
  PickDepartmentScreen: {
    setDepartment: Dispatch<SetStateAction<IPickDepartment | undefined>>;
    department: IPickDepartment | undefined;
  };

  PickItemScreen: {
    setItem: Dispatch<SetStateAction<IPickItem>>;
  };

  PickRequesterScreen: {
    setRequester: Dispatch<SetStateAction<SelectedOption>>;
    requester: SelectedOption;
  };
  PickStatusScreen: {
    setStatus: Dispatch<SetStateAction<IStausGlobal | undefined>>;
    status: IStausGlobal | undefined;
  };
  PickLocalScreen: {
    setLocation: Dispatch<SetStateAction<IPickLocal | undefined>>;
    location: IPickLocal | undefined;
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
    hotel: IDataListHotel | undefined;
    setHotel: (i: IDataListHotel | undefined) => void;
  };
};

// ─────────────────────────────────────────────────────────────
// Gộp chung Stack Navigation
// ─────────────────────────────────────────────────────────────

export type RootStackParams = MainParams & AuthParams;

// ─────────────────────────────────────────────────────────────
// Typed Navigation Props dùng trong screen components
// ─────────────────────────────────────────────────────────────
