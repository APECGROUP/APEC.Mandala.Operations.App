import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { s } from 'react-native-size-matters';
const IconWaitingCheckOut = (props: SvgProps) => (
  <Svg width={s(20)} height={s(20)} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M3.33337 4H16.092C16.1505 3.9999 16.2079 4.01516 16.2586 4.04426C16.3092 4.07335 16.3514 4.11525 16.3808 4.16576C16.4101 4.21627 16.4257 4.27361 16.4259 4.33204C16.4262 4.39047 16.411 4.44793 16.382 4.49867L14 8.66667L16.382 12.8347C16.411 12.8854 16.4262 12.9429 16.4259 13.0013C16.4257 13.0597 16.4101 13.1171 16.3808 13.1676C16.3514 13.2181 16.3092 13.26 16.2586 13.2891C16.2079 13.3182 16.1505 13.3334 16.092 13.3333H4.66671V16.6667H3.33337V4Z"
      fill="#FF6F2C"
    />
  </Svg>
);
export default IconWaitingCheckOut;
