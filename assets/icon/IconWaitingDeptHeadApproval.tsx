// IconWaitingDeptHeadApproval
import * as React from 'react';
import {s} from 'react-native-size-matters';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
const IconWaitingDeptHeadApproval = (props: SvgProps) => (
  <Svg width={s(40)} height={s(40)} viewBox="0 0 40 40" fill="none" {...props}>
    <Rect width={40} height={40} rx={20} fill="#FFF7D4" />
    <Path
      d="M25.3307 26.6667V21.6667L22.9974 20.6667H22.6641L20.3307 26.6667H19.6641L17.3307 20.6667H16.9974L14.6641 21.6667V26.6667"
      stroke="#F79009"
      strokeWidth={1.5}
      strokeLinecap="square"
    />
    <Path
      d="M19.6654 24.6665L19.9987 21.9998L19.332 20.6665H20.6654L19.9987 21.9998L20.332 24.6665L19.9987 25.6665L19.6654 24.6665Z"
      fill="#F79009"
    />
    <Path
      d="M19.9987 21.9998L19.6654 24.6665L19.9987 25.6665L20.332 24.6665L19.9987 21.9998ZM19.9987 21.9998L19.332 20.6665H20.6654L19.9987 21.9998Z"
      stroke="#F79009"
      strokeLinecap="square"
    />
    <Path
      d="M22.3307 16.3333V15.6666C22.3307 14.3779 21.2861 13.3333 19.9974 13.3333C18.7087 13.3333 17.6641 14.3779 17.6641 15.6666V16.3333C17.6641 17.6219 18.7087 18.6666 19.9974 18.6666C21.2861 18.6666 22.3307 17.6219 22.3307 16.3333Z"
      stroke="#F79009"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </Svg>
);
export default IconWaitingDeptHeadApproval;
