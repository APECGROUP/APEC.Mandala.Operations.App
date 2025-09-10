import { Colors } from '@/theme/Config';
import * as React from 'react';
import { s } from 'react-native-size-matters';
import Svg, { SvgProps, Path } from 'react-native-svg';
const IconSearch = (props: SvgProps) => (
  <Svg
    viewBox="0 0 16 16"
    fill="none"
    {...props}
    width={props.width || s(16)}
    height={props.width || s(16)}>
    <Path
      d="M7.33398 1.33334C10.646 1.33334 13.334 4.02134 13.334 7.33334C13.334 10.6453 10.646 13.3333 7.33398 13.3333C4.02198 13.3333 1.33398 10.6453 1.33398 7.33334C1.33398 4.02134 4.02198 1.33334 7.33398 1.33334ZM7.33398 12C9.91232 12 12.0007 9.91168 12.0007 7.33334C12.0007 4.75501 9.91232 2.66668 7.33398 2.66668C4.75565 2.66668 2.66732 4.75501 2.66732 7.33334C2.66732 9.91168 4.75565 12 7.33398 12ZM12.9909 12.0474L14.8764 13.933L13.9337 14.8758L12.0481 12.9902L12.9909 12.0474Z"
      fill={props.fill || Colors.TEXT_DEFAULT || '#BABABA'}
    />
  </Svg>
);
export default IconSearch;
