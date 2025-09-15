import * as React from 'react';
import { s } from 'react-native-size-matters';
import Svg, { SvgProps, Path, G, Circle } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const IconFilterHk = (props: SvgProps) => (
  <Svg width={s(30)} height={s(28)} viewBox="0 0 30 28" fill="none" {...props}>
    <Path d="M10 22H14V20H10V22ZM3 10V12H21V10H3ZM6 17H18V15H6V17Z" fill="#141211" />
    <G filter="url(#filter0_d_2247_9945)">
      <Circle cx={21} cy={7} r={5.5} stroke="white" />
    </G>
  </Svg>
);
export default IconFilterHk;
