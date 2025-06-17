import * as React from 'react';
import {s} from 'react-native-size-matters';
import Svg, {SvgProps, G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const IconDirectChat = (props: SvgProps) => (
  <Svg
    viewBox="0 0 12 12"
    fill="none"
    width={props.width || 12}
    height={props.width || 12}
    {...props}>
    <G clipPath="url(#clip0_1756_12982)">
      <Path
        d="M5.18137 0.248572L0.0386403 11.3912C-0.0419291 11.5686 0.00606974 11.7803 0.158637 11.9037C0.232539 11.9641 0.324573 11.998 0.419996 11.9998C0.515419 12.0017 0.608706 11.9715 0.68491 11.914L5.57051 8.2498L10.4561 11.914C10.613 12.0323 10.8307 12.028 10.9824 11.9046C11.0861 11.8214 11.1418 11.6971 11.1418 11.5712C11.1418 11.5103 11.1289 11.4494 11.1024 11.392L5.95964 0.249429C5.88935 0.0968609 5.73764 6.67572e-06 5.57051 6.67572e-06C5.40337 6.67572e-06 5.25166 0.0968618 5.18137 0.248572Z"
        fill="#FF0000"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1756_12982">
        <Rect
          width={12}
          height={11.1418}
          fill="white"
          transform="matrix(0 -1 1 0 0 12)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default IconDirectChat;
