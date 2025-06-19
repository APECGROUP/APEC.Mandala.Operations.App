import React, { ReactElement, useEffect, useState } from 'react';
import {
  TextStyle,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';

import IconClose from '../../../assets/icon/IconClose';
import { s } from 'react-native-size-matters';
import IconEyeOffOutline from '../../../assets/icon/IconEyeOffOutline';
import IconEyeOutline from '../../../assets/icon/IconEyeOutline';
import { numberFormat } from '../../utils/Utilities';
import FormStyles from './FormStyles';
import { AppText } from '../text/AppText';
import light from '../../theme/light';

type AppInputLabelProps = {
  required?: boolean;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  inline?: boolean;
};
type TextContentType =
  | 'none'
  | 'URL'
  | 'addressCity'
  | 'addressCityAndState'
  | 'addressState'
  | 'countryName'
  | 'creditCardNumber'
  | 'emailAddress'
  | 'familyName'
  | 'fullStreetAddress'
  | 'givenName'
  | 'jobTitle'
  | 'location'
  | 'middleName'
  | 'name'
  | 'namePrefix'
  | 'nameSuffix'
  | 'nickname'
  | 'organizationName'
  | 'postalCode'
  | 'streetAddressLine1'
  | 'streetAddressLine2'
  | 'sublocality'
  | 'telephoneNumber'
  | 'username'
  | 'password'
  | 'newPassword'
  | 'oneTimeCode'
  | undefined;

export function AppInputLabel({ label, required, labelStyle, inline }: AppInputLabelProps) {
  return (
    <View style={[FormStyles.labelContainer, inline && FormStyles.inlineLabel]}>
      <AppText style={labelStyle}>{label}</AppText>
      {required ? <AppText style={FormStyles.colorRed}>{' *'}</AppText> : null}
    </View>
  );
}

interface AppInputRegularProps extends TextInputProps {
  refName?: any;
  required?: boolean;
  validate?: (_str: string) => { error: boolean; message: string };
  error?: string;
  label?: string;
  errorColor?: string;
  containerStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  disabledStyle?: StyleProp<TextStyle>;
  inline?: boolean;
  labelStyle?: TextStyle;
  numberFormat?: boolean;
  leftIcon?: ReactElement | null;
  rightIcon?: ReactElement | null;
  iconColor?: string;
  noBorder?: boolean;
  hideIconRight?: boolean;
  helpTxtStyle?: TextStyle;
  runValidate?: number;
  noHelper?: boolean;
  iconShowPass?: ReactElement;
  iconHidePass?: ReactElement;
  suffix?: ReactElement;
  inputType?: 'phone' | 'email' | 'name';
  onChangeText?: (text: string) => void;
  onPressRightIcon?: () => void;
  errorMessage?: string;
  unit?: string | number | null;
  placeholder?: string;
  textContentType?: TextContentType;
  rightComponent?: ReactElement;
}

export default function AppTextInput(props: AppInputRegularProps) {
  const { required, containerStyle, label, errorColor, editable, placeholder } = props;
  const [value, setValue] = useState(props.value);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(!props.secureTextEntry || false);
  useEffect(() => {
    setError(props.errorMessage ? true : false);
    if (props.errorMessage) {
      setErrorMessage(props.errorMessage);
    } else {
      setErrorMessage('');
    }
  }, [props.error, props.errorMessage, value]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onChangeText = (text: string) => {
    setValue(text);
    props.onChangeText && props.onChangeText(props.numberFormat ? text.replace(/\./g, '') : text);
  };

  const disabled = editable !== undefined && !editable;
  const onRemove = () => onChangeText('');
  return (
    <View style={[FormStyles.item, props.inline && FormStyles.inline, containerStyle]}>
      {label ? (
        <AppInputLabel
          labelStyle={props.labelStyle}
          inline={!!props.inline}
          label={label}
          required={!!required}
        />
      ) : null}
      <View>
        <View
          style={[
            FormStyles.inputView,
            props.inline && FormStyles.itemInputInLine,
            disabled && (props.disabledStyle ?? FormStyles.disabled),
            error && FormStyles.inputError,
            props.inputStyle,
          ]}>
          {props.leftIcon}
          <TextInput
            textContentType={props.textContentType || 'oneTimeCode'}
            ref={props.refName}
            {...props}
            allowFontScaling={false}
            editable={editable}
            keyboardType={props.keyboardType}
            returnKeyType={props.returnKeyType}
            secureTextEntry={!showPassword}
            autoCapitalize={props.autoCapitalize}
            value={
              (props.numberFormat && value && numberFormat(value.replace(/\./g, ''), '.')) || value
            }
            style={[
              FormStyles.input,
              styles.colorBlack,
              props.leftIcon !== null && styles.pl0,
              props.inputTextStyle,
            ]}
            placeholderTextColor={props.placeholderTextColor || light.placeholderTextColor}
            onChangeText={onChangeText}
            maxLength={props.keyboardType === 'phone-pad' ? 10 : props.maxLength || 255}
            placeholder={placeholder}
          />
          {props.suffix}
          {props.secureTextEntry ? (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={FormStyles.eye}>
              {showPassword ? <IconEyeOffOutline /> : <IconEyeOutline />}
            </TouchableOpacity>
          ) : value && !disabled && !props.hideIconRight ? (
            <TouchableOpacity onPress={onRemove} style={styles.w25}>
              <IconClose width={16} />
            </TouchableOpacity>
          ) : null}

          {props.rightIcon && (
            <TouchableOpacity onPress={props.onPressRightIcon}>{props.rightIcon}</TouchableOpacity>
          )}

          {props.rightComponent && props.rightComponent}
        </View>
        {!props.noHelper && errorMessage ? (
          <AppText
            style={{
              ...FormStyles.helperTxt,
              ...props.helpTxtStyle,
              color: errorColor,
            }}>
            {errorMessage}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  colorBlack: { color: '#000' },
  pl0: {
    paddingLeft: 0,
  },
  w25: {
    width: s(25),
    alignItems: 'flex-end',
  },
});
