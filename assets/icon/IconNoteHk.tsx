import * as React from 'react';
import Svg, { SvgProps, Path, G, Circle, Defs } from 'react-native-svg';
import { s } from 'react-native-size-matters';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const IconNoteHk = (props: SvgProps) => (
  <Svg width={s(30)} height={s(28)} viewBox="0 0 30 28" fill="none" {...props}>
    <Path
      d="M20 26H4C3.73478 26 3.48043 25.8946 3.29289 25.7071C3.10536 25.5196 3 25.2652 3 25V7C3 6.73478 3.10536 6.48043 3.29289 6.29289C3.48043 6.10536 3.73478 6 4 6H20C20.2652 6 20.5196 6.10536 20.7071 6.29289C20.8946 6.48043 21 6.73478 21 7V25C21 25.2652 20.8946 25.5196 20.7071 25.7071C20.5196 25.8946 20.2652 26 20 26ZM19 24V8H5V24H19ZM8 11H16V13H8V11ZM8 15H16V17H8V15ZM8 19H16V21H8V19Z"
      fill="#141211"
    />
    <G filter="url(#filter0_d_271_5537)">
      <Circle cx={21} cy={7} r={5} fill="#F22625" />
      <Circle cx={21} cy={7} r={5.5} stroke="white" />
    </G>
    <Defs />
  </Svg>
);
export default IconNoteHk;
