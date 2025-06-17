import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconSub = (props: SvgProps) => (
  <Svg width={vs(10)} height={vs(2)} viewBox="0 0 10 2" fill="none" {...props}>
    <Path
      d="M9 1L1 1"
      stroke="#3A3B3F"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </Svg>
);
export default IconSub;
