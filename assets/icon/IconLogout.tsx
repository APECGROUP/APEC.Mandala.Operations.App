import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconLogout = (props: SvgProps) => (
  <Svg
    width={vs(30)}
    height={vs(30)}
    viewBox="0 0 30 30"
    fill="none"
    {...props}>
    <Rect width={30} height={30} rx={15} fill="#F1F1F1" />
    <Path
      d="M13.8333 14.4166L13.8333 11.4999L17.3333 14.9999L13.8333 18.4999L13.8333 15.5833L9.75 15.5833L9.75 14.4166L13.8333 14.4166ZM19.0833 19.6666L19.0833 10.3333L15 10.3333L15 9.16659L19.6667 9.16659C19.9888 9.16659 20.25 9.42774 20.25 9.74992L20.25 20.2499C20.25 20.5721 19.9888 20.8333 19.6667 20.8333L15 20.8333L15 19.6666L19.0833 19.6666Z"
      fill="#D92D20"
    />
  </Svg>
);
export default IconLogout;
