import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import light from '../../src/theme/light';
import { vs } from 'react-native-size-matters';

function IconEyeOffOutline(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" width={vs(16)} height={vs(16)} {...props}>
      <Path
        d="M12 4.00006C16.182 4.00006 19.028 6.50006 20.725 8.70406C21.575 9.81006 22 10.3611 22 12.0001C22 13.6401 21.575 14.1911 20.725 15.2961M14.1213 14.1214C13.5587 14.684 12.7956 15.0001 12 15.0001C11.2044 15.0001 10.4413 14.684 9.87868 14.1214C9.31607 13.5588 9 12.7957 9 12.0001C9 11.2044 9.31607 10.4413 9.87868 9.87874M3.53033 3.46973L6.03686 5.97626M20.5303 20.4697L18.0332 17.9726M6.03686 5.97626C4.9041 6.79948 3.9881 7.7779 3.275 8.70406C2.425 9.80906 2 10.3601 2 12.0001C2 13.6391 2.425 14.1921 3.275 15.2961C4.972 17.5001 7.818 20.0001 12 20.0001C14.461 20.0001 16.4594 19.1343 18.0332 17.9726M6.03686 5.97626L18.0332 17.9726"
        stroke={light.black}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default IconEyeOffOutline;
