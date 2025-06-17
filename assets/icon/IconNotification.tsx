import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconNotification = (props: SvgProps) => (
  <Svg
    width={vs(40)}
    height={vs(40)}
    viewBox="0 0 40 40"
    fill="none"
    {...props}>
    <Rect width={40} height={40} rx={20} fill="white" fillOpacity={0.1} />
    <Path
      d="M26.666 24.1667H28.3327V25.8334H11.666V24.1667H13.3327V18.3334C13.3327 14.6515 16.3174 11.6667 19.9993 11.6667C23.6813 11.6667 26.666 14.6515 26.666 18.3334V24.1667ZM17.4993 27.5001H22.4993V29.1667H17.4993V27.5001Z"
      fill="white"
    />
  </Svg>
);
export default IconNotification;
