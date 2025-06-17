import {useTranslation} from 'react-i18next';
import {LanguageType} from './locales/type';
export function Strings(str: LanguageType | string) {
  const {t} = useTranslation();
  return t(str);
}
