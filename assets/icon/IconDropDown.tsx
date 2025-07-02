import * as React from 'react';
import { vs } from 'react-native-size-matters';
import Svg, { SvgProps, Path } from 'react-native-svg';
const IconDropDown = (props: SvgProps) => (
  <Svg
    width={props.width || vs(20)}
    height={props.width || vs(20)}
    viewBox="0 0 20 20"
    fill="none"
    {...props}>
    <Path
      d="M9.9994 10.9766L14.1244 6.85156L15.3027 8.0299L9.9994 13.3332L4.69607 8.02989L5.8744 6.85156L9.9994 10.9766Z"
      fill={props.fill || '#141414'}
    />
  </Svg>
);

export default IconDropDown;
