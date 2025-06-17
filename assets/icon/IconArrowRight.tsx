import {getSvgSize} from '@smileTech/helpers/sizeHelper';
import * as React from 'react';
import {vs} from 'react-native-size-matters';
import Svg, {SvgProps, Path} from 'react-native-svg';

const IconArrowRight = (props: SvgProps) => (
  <Svg
    viewBox="0 0 7 13"
    fill="none"
    width={props.width || vs(7)}
    height={props.height || vs(13)}
    {...props}>
    <Path
      d="M1 1.5L6 6.5L1 11.5"
      stroke={props.stroke || '#BABABA'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconArrowRight;
