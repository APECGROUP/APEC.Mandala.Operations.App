import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {Path, SvgProps} from 'react-native-svg';
const IconSelectHotel = (props: SvgProps) => (
  <Svg
    viewBox="0 0 14 14"
    fill="none"
    width={props.width || vs(14)}
    height={props.width || vs(14)}
    {...props}>
    <Path
      d="M5.8334 8.84977L11.1956 3.48755L12.0206 4.3125L5.8334 10.4997L2.12109 6.7874L2.94606 5.96245L5.8334 8.84977Z"
      fill="#1E6F2F"
    />
  </Svg>
);
export default IconSelectHotel;
