import { useState, useEffect } from 'react';
import DataLocal from '../data/DataLocal';
import { getDeviceLanguage } from '@/languages/i18n';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(getDeviceLanguage());

  useEffect(() => {
    // Load ngôn ngữ hiện tại khi hook được khởi tạo
    const loadCurrentLanguage = () => {
      const language = DataLocal.getLanguage();
      if (language && language !== '') {
        setCurrentLanguage(language);
      }
    };

    loadCurrentLanguage();
  }, []);

  const changeLanguage = async (language: 'vi' | 'en') => {
    try {
      await DataLocal.saveLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
    await changeLanguage(newLanguage);
  };

  return {
    currentLanguage,
    changeLanguage,
    toggleLanguage,
    isVietnamese: currentLanguage === 'vi',
    isEnglish: currentLanguage === 'en',
  };
};
