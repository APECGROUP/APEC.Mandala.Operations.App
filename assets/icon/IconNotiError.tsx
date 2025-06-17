import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconNotiError = (props: SvgProps) => (
  <Svg
    width={vs(14)}
    height={vs(14)}
    viewBox="0 0 14 14"
    fill="none"
    {...props}>
    <Path
      d="M7.00109 1.3125C7.15987 1.3125 7.3067 1.39839 7.3839 1.53711L13.2169 12.0371C13.2921 12.1725 13.2905 12.3381 13.212 12.4717C13.1335 12.6052 12.99 12.6874 12.8351 12.6875H1.16808C1.01307 12.6875 0.869744 12.6053 0.791131 12.4717C0.71256 12.3381 0.710004 12.1726 0.785272 12.0371L6.61926 1.53711C6.69644 1.39857 6.84249 1.3126 7.00109 1.3125ZM6.56359 9.625V10.5H7.43859V9.625H6.56359ZM6.56359 5.83301V8.75H7.43859V5.83301H6.56359Z"
      fill="white"
    />
  </Svg>
);
export default IconNotiError;
