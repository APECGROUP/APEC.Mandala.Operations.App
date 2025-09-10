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
// const a = [
//   {
//     status: 'PM',
//     statusName: 'Chờ TBP duyệt',
//   },
//   {
//     status: 'PP',
//     statusName: 'Chờ gán giá',
//   },
//   {
//     status: 'PA',
//     statusName: 'Chờ KTT duyệt',
//   },
//   {
//     status: 'PC',
//     statusName: 'Chờ GM/OM duyệt',
//   },
//   {
//     status: 'PO',
//     statusName: 'Chờ tạo PO',
//   },
//   {
//     status: 'AP',
//     statusName: 'Đã phê duyệt tạo PO',
//   },
//   {
//     status: 'CC',
//     statusName: 'Hủy bỏ',
//   },
//   {
//     status: 'RJ',
//     statusName: 'Từ chối',
//   },
// ];

export interface IUseStatusGlobal {
  statusGlobal: IItemStatus[];
  setStatusGlobal: (val: IItemStatus[]) => void;
}
export const useStatusGlobal = create<IUseStatusGlobal>(set => ({
  statusGlobal: [],
  setStatusGlobal: (val: IItemStatus[]) => set({ statusGlobal: val }),
}));
