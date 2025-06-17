import {StyleSheet} from 'react-native';

import type {ViewStyle} from 'react-native';

export function handleMargin(
  margin: boolean | `${number}%` | number | number[],
): ViewStyle {
  if (typeof margin === 'boolean') {
    return {
      margin: 15,
    };
  }
  if (typeof margin === 'number') {
    return {
      marginTop: margin,
      marginBottom: margin,
      marginLeft: margin,
      marginRight: margin,
    };
  }

  if (typeof margin === 'string') {
    return {
      marginTop: margin,
      marginBottom: margin,
      marginLeft: margin,
      marginRight: margin,
    };
  }

  const marginSize = Object.keys(margin).length;
  switch (marginSize) {
    case 1:
      return {
        marginTop: margin[0],
        marginRight: margin[0],
        marginBottom: margin[0],
        marginLeft: margin[0],
      };
    case 2:
      return {
        marginTop: margin[0],
        marginRight: margin[1],
        marginBottom: margin[0],
        marginLeft: margin[1],
      };
    case 3:
      return {
        marginTop: margin[0],
        marginRight: margin[1],
        marginBottom: margin[2],
        marginLeft: margin[1],
      };
    default:
      return {
        marginTop: margin[0],
        marginRight: margin[1],
        marginBottom: margin[2],
        marginLeft: margin[3],
      };
  }
}

export function handlePadding(padding: boolean | number | number[]): ViewStyle {
  if (typeof padding === 'boolean') {
    return {
      padding: 15,
    };
  }
  if (typeof padding === 'number') {
    return {
      paddingTop: padding,
      paddingRight: padding,
      paddingBottom: padding,
      paddingLeft: padding,
    };
  }
  if (typeof padding === 'string') {
    return {
      marginTop: padding,
      marginBottom: padding,
      marginLeft: padding,
      marginRight: padding,
    };
  }
  const marginSize = Object.keys(padding).length;
  switch (marginSize) {
    case 1:
      return {
        paddingTop: padding[0],
        paddingRight: padding[0],
        paddingBottom: padding[0],
        paddingLeft: padding[0],
      };
    case 2:
      return {
        paddingTop: padding[0],
        paddingRight: padding[1],
        paddingBottom: padding[0],
        paddingLeft: padding[1],
      };
    case 3:
      return {
        paddingTop: padding[0],
        paddingRight: padding[1],
        paddingBottom: padding[2],
        paddingLeft: padding[1],
      };
    default:
      return {
        paddingTop: padding[0],
        paddingRight: padding[1],
        paddingBottom: padding[2],
        paddingLeft: padding[3],
      };
  }
}

export function handleBorder(
  border: boolean | number | number[],
  borderColor: string,
): ViewStyle {
  if (typeof border === 'boolean') {
    return {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor,
    };
  }

  if (typeof border === 'number') {
    return {
      borderTopWidth: border,
      borderRightWidth: border,
      borderBottomWidth: border,
      borderLeftWidth: border,
      borderColor,
    };
  }
  const marginSize = Object.keys(border).length;
  switch (marginSize) {
    case 1:
      return {
        borderTopWidth: border[0],
        borderRightWidth: border[0],
        borderBottomWidth: border[0],
        borderLeftWidth: border[0],
        borderColor,
      };
    case 2:
      return {
        borderTopWidth: border[0],
        borderRightWidth: border[1],
        borderBottomWidth: border[0],
        borderLeftWidth: border[1],
        borderColor,
      };
    case 3:
      return {
        borderTopWidth: border[0],
        borderRightWidth: border[1],
        borderBottomWidth: border[2],
        borderLeftWidth: border[1],
        borderColor,
      };
    default:
      return {
        borderTopWidth: border[0],
        borderRightWidth: border[1],
        borderBottomWidth: border[2],
        borderLeftWidth: border[3],
        borderColor,
      };
  }
}
