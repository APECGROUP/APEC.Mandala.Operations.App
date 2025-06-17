import {COLORS_DARK, COLORS_DEFAULT} from './colors';
const THEME_APP: 'light' | 'dark' = 'light';
export const themeApp = () => {
  const value = THEME_APP;
  switch (value) {
    case 'light':
      return COLORS_DEFAULT;
    case 'dark':
      return COLORS_DARK;
    default:
      return COLORS_DEFAULT;
  }
};

export const Colors = themeApp();
