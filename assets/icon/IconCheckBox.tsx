import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';
const IconCheckBox = (props: SvgProps) => (
  <Svg
    viewBox="0 0 16 16"
    fill="none"
    width={vs(16)}
    height={vs(16)}
    {...props}>
    <Rect x={0.5} y={0.5} width={15} height={15} rx={3.5} fill="#1E6F2F" />
    <Rect x={0.5} y={0.5} width={15} height={15} rx={3.5} stroke="#F1F1F1" />
    <Path
      d="M6.8334 9.84977L12.1956 4.48755L13.0206 5.3125L6.8334 11.4997L3.12109 7.7874L3.94606 6.96245L6.8334 9.84977Z"
      fill="white"
    />
  </Svg>
);
export default IconCheckBox;
