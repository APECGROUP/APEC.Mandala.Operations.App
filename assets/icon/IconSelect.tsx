import * as React from 'react';
import Svg, {SvgProps, Circle} from 'react-native-svg';
const IconSelect = (props: SvgProps) => (
  <Svg
    viewBox="0 0 18 18"
    fill="none"
    {...props}
    width={props.width || 18}
    height={props.width || 18}>
    <Circle cx={9} cy={9} r={8.25} stroke="#FF0000" strokeWidth={1.5} />
    <Circle cx={9} cy={9} r={6} fill="#FF0000" />
  </Svg>
);
export default IconSelect;
