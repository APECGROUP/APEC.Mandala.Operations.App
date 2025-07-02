import * as React from 'react';
import { vs } from 'react-native-size-matters';
import Svg, { SvgProps, Path } from 'react-native-svg';
const IconPenEdit = (props: SvgProps) => (
  <Svg width={vs(12)} height={vs(12)} viewBox="0 0 12 12" fill="none" {...props}>
    <Path
      d="M3.62132 8.99848H1.5V6.87713L7.2175 1.15963C7.4128 0.964369 7.72935 0.964369 7.9246 1.15963L9.33885 2.57384C9.5341 2.7691 9.5341 3.08569 9.33885 3.28095L3.62132 8.99848ZM1.5 9.99848H10.5V10.9985H1.5V9.99848Z"
      fill="#727272"
    />
  </Svg>
);
export default IconPenEdit;
