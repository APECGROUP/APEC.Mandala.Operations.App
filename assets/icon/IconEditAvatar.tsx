import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconEditAvatar = (props: SvgProps) => (
  <Svg
    width={vs(27)}
    height={vs(26)}
    viewBox="0 0 27 26"
    fill="none"
    {...props}>
    <Rect
      x={0.941399}
      y={0.812492}
      width={24.3748}
      height={24.3748}
      rx={12.1874}
      fill="#1E6F2F"
    />
    <Rect
      x={0.941399}
      y={0.812492}
      width={24.3748}
      height={24.3748}
      rx={12.1874}
      stroke="white"
      strokeWidth={1.62498}
    />
    <Path
      d="M10.336 14.9926L15.4071 9.92154L14.7 9.21443L9.62891 14.2855V14.9926H10.336ZM10.7502 15.9926H8.62891V13.8713L14.3464 8.15377C14.5417 7.95851 14.8583 7.95851 15.0535 8.15377L16.4678 9.56798C16.663 9.76324 16.663 10.0798 16.4678 10.2751L10.7502 15.9926ZM8.62891 16.9926H17.6289V17.9926H8.62891V16.9926Z"
      fill="white"
    />
  </Svg>
);
export default IconEditAvatar;
