import * as React from 'react';
import { s } from 'react-native-size-matters';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
const IconWaitingCreatePo = (props: SvgProps) => (
  <Svg width={s(40)} height={s(40)} viewBox="0 0 40 40" fill="none" {...props}>
    <Rect width={40} height={40} rx={20} fill="#5E45C3" fillOpacity={0.1} />
    <Path
      d="M18.1618 24.6644H26V25.9977H14V23.1693L20.5997 16.5696L23.4281 19.3981L18.1618 24.6644ZM21.5425 15.6268L22.9567 14.2126C23.2171 13.9522 23.6391 13.9522 23.8995 14.2126L25.7851 16.0982C26.0455 16.3586 26.0455 16.7807 25.7851 17.041L24.3709 18.4552L21.5425 15.6268Z"
      fill="#5E45C3"
    />
  </Svg>
);
export default IconWaitingCreatePo;
