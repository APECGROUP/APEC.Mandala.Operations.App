import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const IconPickLocation = (props: SvgProps) => (
  <Svg
    viewBox="0 0 32 32"
    fill="none"
    {...props}
    width={props.width || 32}
    height={props.height || 32}>
    <G clipPath="url(#clip0_57_12085)">
      <G filter="url(#filter0_d_57_12085)">
        <Path
          d="M16 29.3334C16 29.3334 26 21.3334 26 12.6667C26 7.14382 21.5229 2.66669 16 2.66669C10.4771 2.66669 6 7.14382 6 12.6667C6 21.3334 16 29.3334 16 29.3334Z"
          fill="#FF0000"
        />
        <Path
          d="M16 29.3334C16 29.3334 26 21.3334 26 12.6667C26 7.14382 21.5229 2.66669 16 2.66669C10.4771 2.66669 6 7.14382 6 12.6667C6 21.3334 16 29.3334 16 29.3334Z"
          stroke="white"
          strokeWidth={0.666667}
          strokeLinejoin="round"
        />
      </G>
      <Path
        d="M16 16.6667C18.2091 16.6667 20 14.8758 20 12.6667C20 10.4576 18.2091 8.66669 16 8.66669C13.7909 8.66669 12 10.4576 12 12.6667C12 14.8758 13.7909 16.6667 16 16.6667Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_57_12085">
        <Rect width={32} height={32} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default IconPickLocation;
