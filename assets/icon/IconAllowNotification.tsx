import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconAllowNotification = (props: SvgProps) => (
  <Svg
    width={vs(30)}
    height={vs(30)}
    viewBox="0 0 30 30"
    fill="none"
    {...props}>
    <Rect width={30} height={30} rx={15} fill="#F1F1F1" />
    <Path
      d="M19.668 17.9167H20.8346V19.0834H9.16797V17.9167H10.3346V13.8334C10.3346 11.2561 12.424 9.16675 15.0013 9.16675C17.5786 9.16675 19.668 11.2561 19.668 13.8334V17.9167ZM18.5013 17.9167V13.8334C18.5013 11.9004 16.9343 10.3334 15.0013 10.3334C13.0683 10.3334 11.5013 11.9004 11.5013 13.8334V17.9167H18.5013ZM13.2513 20.2501H16.7513V21.4167H13.2513V20.2501Z"
      fill="#141414"
    />
  </Svg>
);
export default IconAllowNotification;
