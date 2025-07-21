import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { s } from 'react-native-size-matters';
const IconStar = (props: SvgProps) => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      d="M8.00002 12.1733L3.29802 14.8053L4.34802 9.52L0.391357 5.86133L5.74269 5.22667L8.00002 0.333332L10.2574 5.22667L15.6087 5.86133L11.652 9.52L12.702 14.8053L8.00002 12.1733ZM8.00002 10.6453L10.8314 12.23L10.1987 9.048L12.5807 6.84467L9.35869 6.46267L8.00002 3.51667L6.64136 6.46333L3.41936 6.84467L5.80136 9.048L5.16869 12.23L8.00002 10.6453Z"
      fill="#333333"
    />
  </Svg>
);
export default IconStar;
