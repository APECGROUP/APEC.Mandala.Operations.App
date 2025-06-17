import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, G, Rect, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const IconCreatePrice = (props: SvgProps) => (
  <Svg
    width={props.width || vs(65)}
    height={props.height || vs(65)}
    viewBox="0 0 65 65"
    fill="none"
    {...props}>
    <G filter="url(#filter0_d_1141_2147)">
      <Rect x={11} y={11} width={45} height={45} rx={22.5} fill="#FF7009" />
      <Path
        d="M32.6429 32.6429V27.5H34.3571V32.6429H39.5V34.3571H34.3571V39.5H32.6429V34.3571H27.5V32.6429H32.6429Z"
        fill="white"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default IconCreatePrice;
