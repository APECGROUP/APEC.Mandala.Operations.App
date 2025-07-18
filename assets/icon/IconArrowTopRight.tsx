import * as React from 'react';
import { s } from 'react-native-size-matters';
import Svg, { SvgProps, Path } from 'react-native-svg';
const IconArrowTopRight = (props: SvgProps) => (
  <Svg width={s(20)} height={s(20)} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M13.3367 7.845L6.1642 15.0175L4.98587 13.8392L12.1575 6.66667H5.8367V5H15.0034V14.1667H13.3367V7.845Z"
      fill="#44921F"
    />
  </Svg>
);
export default IconArrowTopRight;
