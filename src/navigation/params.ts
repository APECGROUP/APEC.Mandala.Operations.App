import { Dispatch, SetStateAction } from 'react';
import { ResponseImageElement } from '../interface/Verify.interface';
import {
  AssignPriceFilters,
  IItemAssignPrice,
} from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import { IItemSupplier } from '@/views/modal/modalPickNcc/modal/PickNccModal';
import { IPickDepartment } from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import { IApprove } from '@/screens/approvePrScreen/modal/ApproveModal';
import { IDataListHotel } from '@/views/modal/modalPickHotel/modal/PickHotelModal';
import { IItemPcPr, PcPrFilters } from '@/screens/pcPrScreen/modal/PcPrModal';
import { IPickLocal } from '@/views/modal/modalPickLocal/modal/PickLocalModal';
import { IPickItem } from '@/views/modal/modalPickItem/modal/PickItemModal';
import { IItemStatus } from '@/zustand/store/useStatusGlobal/useStatusGlobal';
import { IPickRequester } from '@/views/modal/modalPickRequester/modal/PickRequesterModal';
import {
  CreatePriceFilters,
  IItemVendorPrice,
} from '@/screens/createPriceScreen/modal/CreatePriceModal';

// ─────────────────────────────────────────────────────────────
// Bottom Tab Navigation
// ─────────────────────────────────────────────────────────────

export type TabBarParams = {
  AssignPriceScreen: undefined;
  CreatePriceScreen: undefined;
  CreatePoScreen: undefined;
  PcLogScreen: undefined;
  PcPrScreen: undefined;
  ApprovePrScreen: undefined;
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
  EditPriceNCCScreen: { item: IItemVendorPrice; onUpdateItem: (item: IItemVendorPrice) => void };
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
    currentFilters: CreatePriceFilters;
    onApplyFilters: (filters: CreatePriceFilters) => void;
  };
  DetailAssignPriceCardScreen: { item: IItemPcPr };
  DetailPcPrCardScreen: { item: IItemPcPr };
  DetailNotificationScreen: { PrNo: string };
  DetailApproveCardScreen: { item: IApprove };
  InformationItemsAssignPrice:
    | { item: IItemAssignPrice; updateCacheAndTotal: (v: number) => void }
    | { item: { id: number; prNo: string }; updateCacheAndTotal: (v: number) => void };
  InformationItemsPcPrScreen: { item: IItemPcPr } | { item: { id: number; prNo: string } };
  MyTabs: undefined;
  MyTabsHk: undefined;
  NotificationScreen: undefined;
  NotificationHkScreen: undefined;
  DetailOrderApproveScreen: {
    item: IItemAssignPrice | { id: number; prNo: string };
    onApproved: (id: number, listData: IItemAssignPrice[]) => void;
  };

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
    setNcc: Dispatch<SetStateAction<IItemSupplier | undefined>> | ((i: IItemSupplier) => void);
    ncc: IItemSupplier | undefined;
  };
  PickPriceFromNccScreen: {
    onSetNcc: (i: IItemVendorPrice) => void;
    ncc: IItemVendorPrice | undefined;
    itemCode: string;
    onSetPrice: (price: number) => void;
    requestDate: string;
  };
  PickDepartmentScreen: {
    setDepartment: Dispatch<SetStateAction<IPickDepartment | undefined>>;
    department: IPickDepartment | undefined;
  };

  PickItemScreen: {
    setItem: Dispatch<SetStateAction<IPickItem | undefined>> | ((i: IPickItem | undefined) => void);
  };

  PickRequesterScreen: {
    setRequester: Dispatch<SetStateAction<IPickRequester | undefined>>;
    requester: IPickRequester | undefined;
  };
  PickStatusScreen: {
    setStatus: Dispatch<SetStateAction<IItemStatus | undefined>>;
    status: IItemStatus | undefined;
  };
  PickLocalScreen: {
    setLocation: Dispatch<SetStateAction<IPickLocal | undefined>>;
    location: IPickLocal | undefined;
  };
  ModalInputRejectAssign: {
    id: number;
    prNo: string;
  };
  ModalInputRejectApprove: {
    id: string | number;
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
