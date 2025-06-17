import {Dispatch, SetStateAction} from 'react';
import {ResponseImageElement} from '../interface/Verify.interface';
import {typeHotel, typeNcc} from '../screens/authScreen/LoginScreen';
import {DataAssignPrice} from '@/screens/assignPriceScreen/modal/AssignPriceModal';
import {ResponseNcc} from '@/views/modal/modalPickNcc/modal/PickNccModal';
import {TypePickDepartment} from '@/views/modal/modalPickDepartment/modal/PickDepartmentModal';
import {TypePickRequester} from '@/views/modal/modalPickRequester/modal/PickRequesterModal';

// ─────────────────────────────────────────────────────────────
// Bottom Tab Navigation
// ─────────────────────────────────────────────────────────────

export type TabBarParams = {
  AssignPriceScreen: undefined;
  CreatePriceScreen: undefined;
  tab3: undefined;
  tab4: undefined;
  tab5: undefined;
};

// ─────────────────────────────────────────────────────────────
// Main Stack Navigation (sau khi login)
// ─────────────────────────────────────────────────────────────

export type MainParams = {
  ImageViewScreen: {
    images: {uri: string}[];
    imageIndex: number;
    onRequestClose?: () => void;
  };
  ProfileScreen: undefined;
  CreatePriceNccScreen: undefined;
  AccountScreen: undefined;
  FilterScreen: undefined;
  DetailAssignPriceCardScreen: {item: DataAssignPrice};
  InformationItemsScreen: {item: DataAssignPrice};
  MyTabs: undefined;
  NotificationScreen: undefined;

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
  RegisterScreen: {
    code: string;
    phone: string;
    type: 'forgotPassword' | 'register' | 'confirm';
  };
  ForgotPasswordScreen: undefined;
  NewPasswordScreen: {
    otp: string;
  };
  OTPScreen: {
    phone: string;
    type:
      | 'forgotPassword'
      | 'register'
      | 'confirm'
      | 'unLinkBank'
      | 'verifyEmail';
  };
  ModalPickHotel: {
    setHotel: Dispatch<SetStateAction<typeHotel>>;
    hotel: {
      id: number | undefined;
      name: string | undefined;
    };
  };
};

// ─────────────────────────────────────────────────────────────
// Gộp chung Stack Navigation
// ─────────────────────────────────────────────────────────────

export type RootStackParams = MainParams & AuthParams;

// ─────────────────────────────────────────────────────────────
// Typed Navigation Props dùng trong screen components
// ─────────────────────────────────────────────────────────────
