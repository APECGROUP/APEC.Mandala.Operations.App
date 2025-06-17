import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconAutoAssign = (props: SvgProps) => (
  <Svg
    width={vs(37)}
    height={vs(36)}
    viewBox="0 0 37 36"
    fill="none"
    {...props}>
    <Rect x={0.75} width={36} height={36} rx={18} fill="#E1E1E1" />
    <Path
      d="M18.75 26C14.3317 26 10.75 22.4183 10.75 18C10.75 13.5817 14.3317 10 18.75 10C23.1682 10 26.75 13.5817 26.75 18C26.75 22.4183 23.1682 26 18.75 26ZM15.95 19.6V21.2H17.95V22.8H19.55V21.2H20.35C21.4546 21.2 22.35 20.3046 22.35 19.2C22.35 18.0954 21.4546 17.2 20.35 17.2H17.15C16.9291 17.2 16.75 17.0209 16.75 16.8C16.75 16.5791 16.9291 16.4 17.15 16.4H21.55V14.8H19.55V13.2H17.95V14.8H17.15C16.0454 14.8 15.15 15.6954 15.15 16.8C15.15 17.9046 16.0454 18.8 17.15 18.8H20.35C20.5709 18.8 20.75 18.9791 20.75 19.2C20.75 19.4209 20.5709 19.6 20.35 19.6H15.95Z"
      fill="#141414"
    />
  </Svg>
);
export default IconAutoAssign;
