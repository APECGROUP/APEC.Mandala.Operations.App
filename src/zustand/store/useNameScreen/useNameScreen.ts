import {create} from 'zustand';

interface typeNameScreen {
  nameScreen: string;
  setNameScreen: (val: string) => void;
}
export const useNameScreen = create<typeNameScreen>(set => ({
  nameScreen: '',
  setNameScreen: (val: string) => set(() => ({nameScreen: val})),
}));
