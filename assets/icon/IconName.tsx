import * as React from 'react';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconName = (props: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <Rect width={20} height={20} rx={10} fill="#E9F1EA" />
    <Path
      d="M9.5 11.031V14H10.5V11.031C12.473 11.277 14 12.96 14 15H6C6.00002 14.0257 6.35559 13.0849 7 12.3541C7.64441 11.6234 8.53335 11.1529 9.5 11.031ZM10 10.5C8.3425 10.5 7 9.1575 7 7.5C7 5.8425 8.3425 4.5 10 4.5C11.6575 4.5 13 5.8425 13 7.5C13 9.1575 11.6575 10.5 10 10.5Z"
      fill="#1E6F2F"
    />
  </Svg>
);
export default IconName;
