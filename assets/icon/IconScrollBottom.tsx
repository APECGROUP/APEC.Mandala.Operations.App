import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, G, Rect, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const IconScrollBottom = (props: SvgProps) => (
  <Svg
    width={vs(48)}
    height={vs(48)}
    viewBox="0 0 48 48"
    fill="none"
    {...props}>
    <G filter="url(#filter0_d_901_11686)">
      <Rect x={8} y={7} width={33} height={33} rx={16.5} fill="white" />
      <Path
        d="M24.9888 25.5394L27.6112 22.917L28.3026 23.6084L24.4999 27.4111L20.6973 23.6084L21.3887 22.917L24.011 25.5394V19.5889H24.9888V25.5394Z"
        fill="#1E6F2F"
      />
    </G>
  </Svg>
);
export default IconScrollBottom;
