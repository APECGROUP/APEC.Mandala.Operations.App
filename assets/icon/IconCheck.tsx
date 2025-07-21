import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { s } from 'react-native-size-matters';
const IconCheck = (props: SvgProps) => (
  <Svg width={s(20)} height={s(20)} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M8.33333 12.6433L15.9933 4.9825L17.1725 6.16083L8.33333 15L3.03 9.69666L4.20833 8.51833L8.33333 12.6433Z"
      fill="white"
    />
  </Svg>
);
export default IconCheck;
