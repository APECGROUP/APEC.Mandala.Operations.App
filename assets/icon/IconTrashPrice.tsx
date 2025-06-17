import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconTrashPrice = (props: SvgProps) => (
  <Svg
    width={props.width || vs(17)}
    height={props.height || vs(16)}
    viewBox="0 0 17 16"
    fill="none"
    {...props}>
    <Path
      d="M2.1 4.8H14.9V15.2C14.9 15.6418 14.5418 16 14.1 16H2.9C2.45818 16 2.1 15.6418 2.1 15.2V4.8ZM4.5 2.4V0.8C4.5 0.358176 4.85818 0 5.3 0H11.7C12.1418 0 12.5 0.358176 12.5 0.8V2.4H16.5V4H0.5V2.4H4.5ZM6.1 1.6V2.4H10.9V1.6H6.1ZM6.1 8V12.8H7.7V8H6.1ZM9.3 8V12.8H10.9V8H9.3Z"
      fill="white"
    />
  </Svg>
);
export default IconTrashPrice;
