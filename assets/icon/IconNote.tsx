import * as React from 'react';
import {s} from 'react-native-size-matters';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
const IconNote = (props: SvgProps) => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      d="M11.8995 7.86993L11.4281 7.39853L4.82843 13.9982H2V11.1697L9.54247 3.62727L13.3137 7.39853C13.5741 7.65886 13.5741 8.08099 13.3137 8.34133L8.59967 13.0553L7.65687 12.1125L11.8995 7.86993ZM12.3709 1.74165L14.2565 3.62727C14.5169 3.88761 14.5169 4.30973 14.2565 4.57007L13.3137 5.51288L10.4853 2.68445L11.4281 1.74165C11.6885 1.4813 12.1105 1.4813 12.3709 1.74165Z"
      fill="url(#paint0_linear_990_11331)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_990_11331"
        x1={17.5}
        y1={-3.00006}
        x2={-3.49996}
        y2={18}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#40E0D0" />
        <Stop offset={0.52} stopColor="#FF8C00" />
        <Stop offset={1} stopColor="#FF0080" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default IconNote;
