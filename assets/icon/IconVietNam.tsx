import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const IconVietNam = (props: SvgProps) => (
  <Svg
    width={vs(16)}
    height={vs(16)}
    viewBox="0 0 16 16"
    fill="none"
    {...props}>
    <G clipPath="url(#clip0_360_9689)">
      <Path
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
        fill="#D80027"
      />
      <Path
        d="M8.001 4.17407L8.86437 6.83123H11.6583L9.39793 8.47342L10.2613 11.1306L8.001 9.48839L5.74069 11.1306L6.60406 8.47342L4.34375 6.83123H7.13762L8.001 4.17407Z"
        fill="#FFDA44"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_360_9689">
        <Rect width={16} height={16} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default IconVietNam;
