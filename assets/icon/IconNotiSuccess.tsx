import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconNotiSuccess = (props: SvgProps) => (
  <Svg
    width={vs(14)}
    height={vs(14)}
    viewBox="0 0 14 14"
    fill="none"
    {...props}>
    <Path
      d="M7.00098 0.729492C10.4643 0.729492 13.2715 3.53671 13.2715 7C13.2715 10.4633 10.4643 13.2705 7.00098 13.2705C3.53769 13.2705 0.730469 10.4633 0.730469 7C0.730469 3.53671 3.53769 0.729492 7.00098 0.729492ZM6.09863 7.68262L5.07129 6.6543L4.24609 7.47949L6.13477 9.36914L9.75488 5.41992L8.89551 4.63086L6.09863 7.68262Z"
      fill="white"
    />
  </Svg>
);
export default IconNotiSuccess;
