import {
  DimensionValue,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import React, { memo, useRef } from 'react';
import ModalDatePicker, { ModalPickTimeRef } from './ModalDatePicker';
import { getFontSize } from '../../constants';
import { s, vs } from 'react-native-size-matters';
import light from '../../theme/light';
import { AppInputLabel } from '../textInput/AppTextInput';

export type PropsPickTime = {
  placeholder?: string;
  label?: string;
  onChangeText: any;
  value: string;
  minimumDate?: Date | undefined; // Prop giới hạn thời gian tối thiểu
  maximumDate?: Date | undefined;
  mode?: 'datetime' | 'date' | 'time';
  onPressIn?: () => void;
  isError?: boolean | '';
  disabled?: boolean | false;
  width?: DimensionValue | undefined;
  styleContainer?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>; // Style cho text
  styleTextPlaceholder?: StyleProp<TextStyle>; // Style cho text placeholder
};

const InputPickTime = (props: PropsPickTime) => {
  const refModalBirthDay = useRef<ModalPickTimeRef>();
  const {
    placeholder,
    value,
    width,
    onPressIn,
    isError,
    styleContainer,
    disabled,
    styleText,
    styleTextPlaceholder,
    label,
  } = props;

  return (
    <View style={styles.w100}>
      {label ? <AppInputLabel label={label} /> : null}
      <TouchableOpacity
        disabled={disabled}
        onPress={async () => {
          //Nguyên nhân đóng trước rồi mở là dính case mua bảo hiểm xe máy, chọn năm khác xong kéo tự do, rồi bấm hủy thằng này nó ko render trên máy oppo
          await refModalBirthDay.current?.onCloseModal();
          refModalBirthDay.current?.onShowModal();
          onPressIn && onPressIn();
        }}
        style={[
          styles.input,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            borderColor: isError ? light.danger : light.inputBorder,
            width: width ? width : '60%',
          },
          styleContainer,
        ]}>
        <Text
          style={[
            value && value !== '' ? styles.text : styles.textPlaceholder,
            value && value !== '' ? styleText : styleTextPlaceholder, // Áp dụng style từ props nếu có
          ]}>
          {value && value !== '' ? value : placeholder}
        </Text>
        <ModalDatePicker ref={refModalBirthDay} data={props} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(InputPickTime);

const styles = StyleSheet.create({
  w100: { width: '100%' },
  text: {
    fontSize: getFontSize(16),
    fontWeight: '500',
    color: '#333333',
  },

  textPlaceholder: {
    color: light.textPlaceholder,
    fontSize: getFontSize(12),
  },
  input: {
    height: vs(40),
    fontSize: getFontSize(12),
    justifyContent: 'center',
    paddingHorizontal: s(10),
    borderWidth: 1,
    borderColor: light.inputBorder,
    borderRadius: 4,
    marginBottom: vs(10),
  },
});
