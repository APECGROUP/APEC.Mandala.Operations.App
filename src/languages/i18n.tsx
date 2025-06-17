import en from './locales/en.json';
import vi from './locales/vi.json';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// Lấy ngôn ngữ hệ thống
const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  return locales[0]?.languageTag || 'vi'; // Mặc định là 'en' nếu không tìm thấy
};

i18n.use(initReactI18next).init({
  resources: {
    en: en,
    vi: vi,
  },
  lng: getDeviceLanguage(), // Dùng ngôn ngữ hệ thống
  fallbackLng: 'vi', // Nếu không tìm thấy ngôn ngữ, dùng tiếng Anh
  interpolation: {escapeValue: false},
});

export default i18n;
