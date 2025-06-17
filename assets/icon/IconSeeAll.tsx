import * as React from 'react';
import {s} from 'react-native-size-matters';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconSeeAll = (props: SvgProps) => (
  <Svg width={s(14)} height={s(14)} viewBox="0 0 14 14" fill="none" {...props}>
    <Path
      d="M6.76848 8.02661L7.59215 8.85028L12.5304 3.91201L13.3554 4.73697L7.59215 10.5002L3.87982 6.78784L4.70477 5.96289L5.94423 7.20236L6.76848 8.02661ZM6.76948 6.37712L9.65849 3.48804L10.4812 4.3107L7.59215 7.19973L6.76948 6.37712ZM5.12056 9.67593L4.29629 10.5002L0.583984 6.78784L1.40894 5.96289L2.2332 6.7872L2.23251 6.78784L5.12056 9.67593Z"
      fill="#1E6F2F"
    />
  </Svg>
);
export default IconSeeAll;
