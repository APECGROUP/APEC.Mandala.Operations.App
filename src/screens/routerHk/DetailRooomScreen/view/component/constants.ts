export interface RoomStatus {
  id: number;
  name: string;
  color: string;
  backgroundColor: string;
}

export const ROOM_STATUSES: RoomStatus[] = [
  {
    id: 1,
    name: 'Dirty',
    color: '#FF3B30',
    backgroundColor: '#FFE9E9',
  },
  {
    id: 2,
    name: 'Clean',
    color: '#1D7AFC',
    backgroundColor: '#E9F2FF',
  },
  {
    id: 3,
    name: 'Inspected',
    color: '#44921F',
    backgroundColor: '#EFFCE9',
  },
  {
    id: 4,
    name: 'Pick - up',
    color: '#FDB229',
    backgroundColor: '#FFF7E6',
  },
];
