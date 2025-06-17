import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconPassword = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...props}>
    <Path
      d="M6 10V8.00001C6 7.66001 6.028 7.32501 6.083 7.00001M18 10V8.00001C18.0001 6.78125 17.629 5.59136 16.9361 4.5887C16.2433 3.58604 15.2615 2.81815 14.1215 2.38721C12.9815 1.95628 11.7372 1.88275 10.5544 2.17639C9.37152 2.47004 8.30613 3.11694 7.5 4.03101M11 22H8C5.172 22 3.757 22 2.879 21.121C2 20.243 2 18.828 2 16C2 13.172 2 11.757 2.879 10.879C3.757 10 5.172 10 8 10H16C18.828 10 20.243 10 21.121 10.879C22 11.757 22 13.172 22 16C22 18.828 22 20.243 21.121 21.121C20.243 22 18.828 22 16 22H15"
      stroke={props.stroke || '#8C8C8C'}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
export default IconPassword;
