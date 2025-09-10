import en from './locales/en.json';
import vi from './locales/vi.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// Lấy ngôn ngữ hệ thống
export const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  console.log('getDeviceLanguage', locales);
  return locales[0]?.languageCode || 'vi'; // Mặc định là 'vi' nếu không tìm thấy
};

i18n.use(initReactI18next).init({
  resources: {
    en: en,
    vi: vi,
  },
  lng: getDeviceLanguage(), // Dùng ngôn ngữ hệ thống
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

export default i18n;
