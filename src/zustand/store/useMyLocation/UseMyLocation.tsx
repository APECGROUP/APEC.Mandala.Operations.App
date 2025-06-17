import {create} from 'zustand';
import {LocationBookingCarProps} from '../../../views/maps/MapScreen';

interface typeMyLocation {
  myLocation: LocationBookingCarProps | null;
  setMyLocation: (val: LocationBookingCarProps | null) => void;
}
export const useMyLocation = create<typeMyLocation>(set => ({
  myLocation: {
    latitude: 20.9659267,
    longitude: 105.7593433,
    address: '',
    description: '',
  },
  setMyLocation: (val: LocationBookingCarProps | null) =>
    set(() => ({myLocation: val})),
}));
