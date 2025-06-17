import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';
const IconUnCheckBox = (props: SvgProps) => (
  <Svg
    viewBox="0 0 16 16"
    fill="none"
    width={vs(16)}
    height={vs(16)}
    {...props}>
    <Rect x={0.5} y={0.5} width={15} height={15} rx={3.5} stroke="#D8D8D8" />
  </Svg>
);
export default IconUnCheckBox;
