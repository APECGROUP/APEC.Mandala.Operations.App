import { create } from 'zustand';

export interface IResponseStatusGlobal {
  data: IStausGlobal[];
  pagination: null;
  isSuccess: boolean;
  errors: Error[];
}

export interface IStausGlobal {
  status: string;
  statusName: string;
}

export interface Error {
  id: null;
  code: number;
  message: string;
}

export interface IUseStatusGlobal {
  statusGlobal: IStausGlobal[];
  setStatusGlobal: (val: IStausGlobal[]) => void;
}
export const useStatusGlobal = create<IUseStatusGlobal>(set => ({
  statusGlobal: [],
  setStatusGlobal: (val: IStausGlobal[]) => set({ statusGlobal: val }),
}));
