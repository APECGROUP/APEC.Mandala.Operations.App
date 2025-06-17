import {create} from 'zustand';

interface TypeLogin {
  isLogin: boolean;
  isRememberLogin: boolean;
  setIsLogin: (val: boolean) => void;
  setIsRememberLogin: (val: boolean) => void;
}

export const useIsLogin = create<TypeLogin>(set => ({
  isLogin: false,
  isRememberLogin: false,
  setIsLogin: (val: boolean) => set({isLogin: val}),
  setIsRememberLogin: (val: boolean) => set({isRememberLogin: val}),
}));
