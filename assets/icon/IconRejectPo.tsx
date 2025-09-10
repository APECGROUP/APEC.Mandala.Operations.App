import * as React from 'react';
import { s } from 'react-native-size-matters';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
const IconRejectPo = (props: SvgProps) => (
  <Svg width={s(40)} height={s(40)} viewBox="0 0 40 40" fill="none" {...props}>
    <Rect width={40} height={40} rx={20} fill="#FBEAE9" />
    <Path
      d="M20.0005 19.0577L23.3003 15.7578L24.2431 16.7006L20.9433 20.0005L24.2431 23.3003L23.3003 24.2431L20.0005 20.9433L16.7006 24.2431L15.7578 23.3003L19.0577 20.0005L15.7578 16.7006L16.7006 15.7578L20.0005 19.0577Z"
      fill="#D92D20"
    />
  </Svg>
);
export default IconRejectPo;
