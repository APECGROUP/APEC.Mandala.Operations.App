import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconFilter = (props: SvgProps) => (
  <Svg
    width={vs(14)}
    height={vs(14)}
    viewBox="0 0 14 14"
    fill="none"
    {...props}>
    <Path
      d="M3.25 0.25V2.5H0.25V4H3.25V6.25H4.75V0.25H3.25ZM6.25 4H13.75V2.5H6.25V4ZM10.75 7.75V10H13.75V11.5H10.75V13.75H9.25V7.75H10.75ZM7.75 11.5H0.25V10H7.75V11.5Z"
      fill="#727272"
    />
  </Svg>
);
export default IconFilter;
