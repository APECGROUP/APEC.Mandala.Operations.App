import * as React from 'react'
import Svg, {SvgProps, Path} from 'react-native-svg'

const IconBack = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" height={24} width={24} {...props} >
    <Path
      d="M9.57 5.93018L3.5 12.0002L9.57 18.0702"
      stroke={props.color ?? 'black'}
      strokeWidth={props.strokeWidth || 1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.4999 12H3.66992"
      stroke={props.color ?? 'black'}
      strokeWidth={props.strokeWidth || 1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default IconBack
