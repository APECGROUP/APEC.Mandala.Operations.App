import * as React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';
const IconUnSelect = (props: SvgProps) => (
    <Svg viewBox="0 0 18 18" fill="none" {...props} width={props.width || 18} height={props.height || 18}>
        <Circle cx={9} cy={9} r={8.25} stroke="#524B6B" strokeWidth={1.5} />
    </Svg>
);
export default IconUnSelect;
