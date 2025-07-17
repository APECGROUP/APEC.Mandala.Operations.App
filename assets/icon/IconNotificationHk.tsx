import * as React from 'react';
import { s } from 'react-native-size-matters';
import Svg, { SvgProps, Path, G, Circle, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const IconNotificationHk = (props: SvgProps) => (
  <Svg width={s(30)} height={s(28)} viewBox="0 0 30 28" fill="none" {...props}>
    <Path
      d="M22 24H2V22H3V15.031C3 10.043 7.03 6 12 6C16.97 6 21 10.043 21 15.031V22H22V24ZM5 22H19V15.031C19 11.148 15.866 8 12 8C8.134 8 5 11.148 5 15.031V22ZM9.5 25H14.5C14.5 25.663 14.2366 26.2989 13.7678 26.7678C13.2989 27.2366 12.663 27.5 12 27.5C11.337 27.5 10.7011 27.2366 10.2322 26.7678C9.76339 26.2989 9.5 25.663 9.5 25Z"
      fill="#141211"
    />
    <G filter="url(#filter0_d_1610_8236)">
      <Circle cx={21} cy={7} r={5} fill="#F22625" />
      <Circle cx={21} cy={7} r={5.5} stroke="white" />
    </G>
    <Defs />
  </Svg>
);
export default IconNotificationHk;
