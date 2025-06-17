import {
  KeyboardType,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect} from 'react';
import {ms, s, vs} from 'react-native-size-matters';
import IconSearch from '../../../assets/icon/IconSearch';
import IconClose from '../../../assets/icon/IconClose';
type Props = {
  // onChangeText: React.Dispatch<React.SetStateAction<string>>;
  onChangeText: (v: string) => void;
  onPressIn?: () => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  value?: string | null;
  stroke?: string;
  fill?: string;
  editable?: boolean;
  isLoading?: boolean;
  right?: boolean;
  width?: number;
  onSubmitEditing?: () => void;
  showIconRemove?: boolean;
  keyboardType?: KeyboardType;
};
export default function AppInputSearch({
  onChangeText,
  placeholder,
  value,
  onPressIn,
  containerStyle,
  inputStyle,
  editable,
  width,
  right,
  stroke,
  fill,
  onSubmitEditing,
  showIconRemove,
  keyboardType = 'default',
}: Props) {
  // const [value1, setValue1] = useState(value);
  const onFocusDefault = () => {};
  // useEffect(() => {
  //     const mSetTimeout = setTimeout(() => {
  //         onChangeText(value1);
  //     }, 1000);
  //     return () => {
  //         clearTimeout(mSetTimeout);
  //     };
  // }, [value1]);
  useEffect(() => {
    return () => {
      if (value) {
        onChangeText('');
      }
    };
  }, []);

  if (right) {
    return (
      <View
        style={[
          styles.containerStyle,
          containerStyle,
          (width && {width: width}) || undefined,
        ]}>
        <TextInput
          value={value}
          onPressIn={onPressIn ?? onFocusDefault}
          placeholder={placeholder ?? 'Tìm kiếm sản phẩm'}
          placeholderTextColor="#949494"
          style={[
            styles.TextInput,
            inputStyle,
            (width && {width: width * 0.9}) || undefined,
          ]}
          onChangeText={onChangeText}
          editable={editable}
          maxLength={255}
          onSubmitEditing={onSubmitEditing ?? undefined}
        />

        <TouchableOpacity onPress={onSubmitEditing ?? undefined}>
          <IconSearch stroke={stroke} fill={fill} />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.containerStyle,
        containerStyle,
        (width && {width: width}) || undefined,
      ]}>
      <IconSearch stroke={stroke} fill={fill} />
      <TextInput
        keyboardType={keyboardType}
        defaultValue={value}
        maxLength={255}
        onPressIn={onPressIn ?? onFocusDefault}
        placeholder={placeholder ?? 'Tìm kiếm sản phẩm'}
        placeholderTextColor="#949494"
        style={[
          styles.TextInput,
          {marginRight: s(12)},
          (width && {width: width * 0.9}) || undefined,
          inputStyle,
        ]}
        onChangeText={onChangeText}
        editable={editable}
      />
      {showIconRemove && value ? (
        <TouchableOpacity
          style={styles.buttonRemove}
          onPress={() => onChangeText('')}
          activeOpacity={0.9}>
          <IconClose />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRemove: {
    position: 'absolute',
    right: s(12),
    paddingVertical: vs(12),
    paddingLeft: s(16),
  },
  containerStyle: {
    height: ms(39),
    borderRadius: 32,
    paddingVertical: vs(12),
    paddingHorizontal: s(8),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    // zIndex: 2,

    // elevation: 2,
    // // shadowColor: '#B9D0EF',
    // backgroundColor: 'white',
    // shadowOpacity: 0.25,
    // shadowRadius: 5,

    // shadowOffset: {
    //     width: 0,
    //     height: 1,
    // },
    borderColor: '#BEBEBE',
    borderWidth: 1,
  },

  TextInput: {
    paddingLeft: s(8),
    fontWeight: '500',
    color: '#333333',
    fontSize: vs(12),
    height: vs(44),
    flex: 1,
    paddingVertical: 0,
  },
});
