import { create } from 'zustand';

export interface IResponsePickStatus {
  data: IItemStatus[];
  pagination: null;
  isSuccess: boolean;
  errors: Error[];
}

export interface IItemStatus {
  status: string;
  statusName: string;
}

export interface Error {
  id: null;
  code: number;
  message: string;
}

export interface IUseStatusGlobal {
  statusGlobal: IItemStatus[];
  setStatusGlobal: (val: IItemStatus[]) => void;
}
export const useStatusGlobal = create<IUseStatusGlobal>(set => ({
  statusGlobal: [],
  setStatusGlobal: (val: IItemStatus[]) => set({ statusGlobal: val }),
}));
