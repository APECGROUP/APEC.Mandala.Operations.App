import * as React from 'react';
import {s} from 'react-native-size-matters';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconWaitingAssignPrice = (props: SvgProps) => (
  <Svg width={s(40)} height={s(40)} viewBox="0 0 40 40" fill="none" {...props}>
    <Rect width={40} height={40} rx={20} fill="#FBEAE9" />
    <Path
      d="M20 18.6666L26 15.9999L20 13.3333L14 15.9999L20 18.6666Z"
      stroke="#D92D20"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M23 14.6665L17 17.3332"
      stroke="#D92D20"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <Path
      d="M16 20L17.3333 20.6667"
      stroke="#D92D20"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <Path
      d="M14.0039 16V23.9873L20.0071 26.6667L26.0039 23.9848V16.009M20.014 18.6891V26.6407"
      stroke="#D92D20"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
export default IconWaitingAssignPrice;
