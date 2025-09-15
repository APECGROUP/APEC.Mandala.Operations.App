import { create } from 'zustand';
import { navigate } from '@/navigation/RootNavigation'; // Import hàm navigate
import { RoomData } from '@/screens/routerHk/homeScreen/modal/HomeModal';

const fakeDataBuilding = [
  { name: 'A', id: 'A' },
  { name: 'B', id: 'B' },
  { name: 'C', id: 'C' },
  { name: 'D', id: 'D' },
  { name: 'E', id: 'E' },
];

const fakeDataFloor = [
  { name: 'Tầng 1', id: '1' },
  { name: 'Tầng 2', id: '2' },
  { name: 'Tầng 3', id: '3' },
  { name: 'Tầng 4', id: '4' },
  { name: 'Tầng 5', id: '5' },
  { name: 'Tầng 6', id: '6' },
  { name: 'Tầng 7', id: '7' },
  { name: 'Tầng 8', id: '8' },
  { name: 'Tầng 9', id: '9' },
  { name: 'Tầng 10', id: '10' },
  { name: 'Tầng 11', id: '11' },
  { name: 'Tầng 12', id: '12' },
  { name: 'Tầng 13', id: '13' },
  { name: 'Tầng 14', id: '14' },
  { name: 'Tầng 15', id: '15' },
  { name: 'Tầng 16', id: '16' },
  { name: 'Tầng 17', id: '17' },
  { name: 'Tầng 18', id: '18' },
  { name: 'Tầng 19', id: '19' },
  { name: 'Tầng 20', id: '20' },
  { name: 'Tầng 21', id: '21' },
  { name: 'Tầng 22', id: '22' },
  { name: 'Tầng 23', id: '23' },
  { name: 'Tầng 24', id: '24' },
  { name: 'Tầng 25', id: '25' },
  { name: 'Tầng 26', id: '26' },
  { name: 'Tầng 27', id: '27' },
  { name: 'Tầng 28', id: '28' },
  { name: 'Tầng 29', id: '29' },
];

interface Building {
  name: string;
  id: string;
}

interface Floor {
  name: string;
  id: string;
}

interface HomeState {
  selectedRoom: RoomData | null;
  buildingSelected: Building | undefined;
  floorSelected: Floor[] | undefined;
  isAll: boolean;
  listBuilding: Building[] | undefined;
  listFloor: Floor[] | undefined;

  // Actions
  setSelectedRoom: (room: RoomData | null) => void;
  setBuildingSelected: (building: Building | undefined) => void;
  setFloorSelected: (floors: Floor[] | undefined) => void;
  getListBuilding: () => void;
  getListFloor: (buildingId: string) => void;
  setIsAll: (isAll: boolean) => void;
  onPressBuilding: () => void;
  onPressLocation: () => void;
  onPressAll: () => void;
  onPressPriority: () => void;
  onPressMinibar: () => void;
  onPressCo: () => void;
  onPressBroken: () => void;
  onPressLost: () => void;
}

export const useHk = create<HomeState>((set, get) => ({
  selectedRoom: null,
  buildingSelected: undefined,
  floorSelected: undefined,
  isAll: true,
  listBuilding: fakeDataBuilding,
  listFloor: undefined,

  // Định nghĩa các actions để cập nhật state
  setSelectedRoom: room => set({ selectedRoom: room }),
  setBuildingSelected: building => {
    // eslint-disable-next-line no-new
    new Promise(resolve => {
      setTimeout(() => {
        resolve(fakeDataFloor);
        set({ listFloor: fakeDataFloor });
      }, 500);
    });
    set({ buildingSelected: building });
  },
  setFloorSelected: floors => set({ floorSelected: floors }),
  setIsAll: isAll => set({ isAll: isAll }),

  getListBuilding: async () => {
    try {
      // eslint-disable-next-line no-new
      new Promise(resolve => {
        setTimeout(() => {
          resolve(fakeDataBuilding);
          set({ listBuilding: fakeDataBuilding });
        }, 500);
      });
    } catch (error) {}
  },
  getListFloor: async () => {
    if (!get().buildingSelected) return;
    try {
      // eslint-disable-next-line no-new
      new Promise(resolve => {
        setTimeout(() => {
          resolve(fakeDataFloor);
          set({ listFloor: fakeDataFloor });
        }, 500);
      });
    } catch (error) {}
  },

  // Định nghĩa các hàm xử lý sự kiện
  onPressBuilding: () => {
    navigate('ModalPickBuilding', {
      building: get().buildingSelected, // Lấy state hiện tại từ `get()`
      setBuilding: get().setBuildingSelected, // Lấy action từ `get()`
    });
  },

  onPressLocation: () => {
    navigate('ModalPickFloor', {
      floor: get().floorSelected, // Lấy state hiện tại từ `get()`
      setFloor: get().setFloorSelected, // Lấy action từ `get()`
    });
  },

  onPressAll: () => {
    console.log('onPressAll');
    get().setIsAll(true); // Gọi action để cập nhật state
  },

  onPressPriority: () => {
    console.log('onPressPriority');
    get().setIsAll(false);
  },

  onPressMinibar: () => {
    console.log('onPressMinibar');
    // Logic cho Minibar
  },

  onPressCo: () => {
    console.log('onPressCo');
    // Logic cho CO
  },

  onPressBroken: () => {
    console.log('onPressBroken');
    // Logic cho Broken
  },

  onPressLost: () => {
    console.log('onPressLost');
    // Logic cho Lost
  },
}));
