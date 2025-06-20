import { useState, useEffect } from 'react';
import DataLocal from '../data/DataLocal';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('vi');

  useEffect(() => {
    // Load ngôn ngữ hiện tại khi hook được khởi tạo
    const loadCurrentLanguage = () => {
      const language = DataLocal.getLanguage();
      setCurrentLanguage(language);
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
