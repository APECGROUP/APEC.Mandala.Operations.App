import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconSaveTmp = (props: SvgProps) => (
  <Svg
    width={vs(37)}
    height={vs(36)}
    viewBox="0 0 37 36"
    fill="none"
    {...props}>
    <Rect x={0.25} width={36} height={36} rx={18} fill="#E1E1E1" />
    <Path
      d="M23.5833 11.3333C23.9515 11.3333 24.25 11.6318 24.25 12V14.5046L18.2508 20.5041L18.2467 23.33L21.0776 23.3341L24.25 20.1613V24C24.25 24.3682 23.9515 24.6666 23.5833 24.6666H12.9167C12.5485 24.6666 12.25 24.3682 12.25 24V12C12.25 11.6318 12.5485 11.3333 12.9167 11.3333H23.5833ZM24.7688 15.8717L25.7116 16.8145L20.5261 22L19.5819 21.9986L19.5833 21.0572L24.7688 15.8717ZM18.25 18H14.9167V19.3333H18.25V18ZM20.25 15.3333H14.9167V16.6666H20.25V15.3333Z"
      fill="#141414"
    />
  </Svg>
);
export default IconSaveTmp;
