import * as React from 'react';
import {s} from 'react-native-size-matters';
import Svg, {SvgProps, Circle} from 'react-native-svg';
const Icon3Dot = (props: SvgProps) => (
  <Svg viewBox="0 0 15 10" fill="none" {...props} width={s(15)} height={s(10)}>
    <Circle cx={1.5} cy={5} r={1.5} fill="#1D1D1D" />
    <Circle cx={7.5} cy={5} r={1.5} fill="#1D1D1D" />
    <Circle cx={13.5} cy={5} r={1.5} fill="#1D1D1D" />
  </Svg>
);
export default Icon3Dot;
