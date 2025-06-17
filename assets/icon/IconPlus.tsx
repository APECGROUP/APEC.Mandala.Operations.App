import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconPlus = (props: SvgProps) => (
  <Svg
    width={vs(10)}
    height={vs(10)}
    viewBox="0 0 10 10"
    fill="none"
    {...props}>
    <Path
      d="M4.28571 4.28571V0H5.71429V4.28571H10V5.71429H5.71429V10H4.28571V5.71429H0V4.28571H4.28571Z"
      fill="#141414"
    />
  </Svg>
);
export default IconPlus;
